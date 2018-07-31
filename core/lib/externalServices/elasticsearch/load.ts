import config from 'config'
import {unlinkSync, writeFileSync} from 'fs'
import AWS from 'lib/aws'
import {s3EachObject} from 'lib/s3'
import {basename} from 'path'
import elasticdump from './elasticdump'

export default async function(name) {
  const s3 = new AWS.S3()
  const Bucket = config.get('dataset.bucket') as string
  const Prefix = `${name}/elasticsearch`

  const files = []
  for await (const {Key} of s3EachObject({
    Bucket,
    Prefix,
  })) {
    files.push(Key)
  }

  await Promise.all(
    files.map(async Key => {
      const index = basename(Key, '.json')
      const url = `${config.get('elasticsearch.url')}/${index}`

      const {Body} = await s3.getObject({Bucket, Key}).promise()
      const filename = `/tmp/${index}.json`
      writeFileSync(filename, Body.toString())
      await elasticdump(filename, url)
      unlinkSync(filename)
    })
  )
}
