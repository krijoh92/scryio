import config from 'config'
import {createWriteStream} from 'fs'
import JSONStream from 'JSONStream'
import AWS from 'lib/aws'
import {PassThrough} from 'stream'
import ReadableStream from './readableStream'

const TableName = config.get('ddes.tableName') as string
const ddb = new AWS.DynamoDB()

export default async function(filePath = `${config.get('rootPath')}/dump.ddb`) {
  const jsonStream = JSONStream.stringify()
  const fileStream = createWriteStream(filePath)

  jsonStream.pipe(fileStream)

  let lastEvaluatedKey

  do {
    const response = await ddb
      .scan({
        TableName,
        Select: 'ALL_ATTRIBUTES',
        ExclusiveStartKey: lastEvaluatedKey,
      })
      .promise()

    for (const item of response.Items) {
      jsonStream.write(item)
    }

    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)

  await new Promise((resolve, reject) => {
    jsonStream.on('error', reject)
    jsonStream.on('end', resolve)
    jsonStream.end()
  })
}
