import {asyncify, queue} from 'async'
import config from 'config'
import {createReadStream} from 'fs'
import JSONStream from 'JSONStream'
import AWS from 'lib/aws'
import logger from 'lib/logger'

const ddb = new AWS.DynamoDB()
const tableName = config.get('ddes.tableName') as string

export default async function(
  filePath = `${config.get('rootPath')}/dump.ddb`,
  {delayBackoffRatio = 1.5} = {}
) {
  if (!filePath) throw new Error('You must provide a file path')

  let itemBuffer = []
  let loadedCount = 0
  let delayBetweenWrites = 1

  const itemQueue = queue(
    asyncify(async items => {
      const {UnprocessedItems} = await ddb
        .batchWriteItem({
          RequestItems: {
            [tableName]: items.map(Item => ({PutRequest: {Item}})),
          },
        })
        .promise()
      loadedCount += items.length

      const unprocessedCommits =
        UnprocessedItems &&
        UnprocessedItems[tableName] &&
        UnprocessedItems[tableName].map(item => item.PutRequest.Item)

      if (unprocessedCommits) {
        delayBetweenWrites *= delayBackoffRatio
        logger.debug(
          `${
            unprocessedCommits.length
          } unprocessed commits. Increased delay between writes to ${delayBetweenWrites}ms`
        )
        itemQueue.unshift([unprocessedCommits])
      }

      await new Promise(resolve => setTimeout(resolve, delayBetweenWrites))
    }),
    config.get('ddes.dynamodbConcurrency')
  )

  const fileStream = createReadStream(filePath)
  const jsonStream = JSONStream.parse('*', item => {
    item.e.B = new Buffer(item.e.B.data)
    itemBuffer.push(item)

    if (itemBuffer.length === 25) {
      itemQueue.push([itemBuffer])
      itemBuffer = []
    }
  })

  fileStream.pipe(jsonStream)

  await new Promise((resolve, reject) => {
    jsonStream.on('error', reject)
    jsonStream.on('end', resolve)
  })

  if (itemBuffer.length) itemQueue.push([itemBuffer])

  await new Promise((resolve, reject) => {
    itemQueue.drain = resolve
    itemQueue.error = reject
  })

  return loadedCount
}
