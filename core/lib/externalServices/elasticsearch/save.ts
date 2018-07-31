import config from 'config'
import {createReadStream, existsSync, unlinkSync} from 'fs'
import AWS from 'lib/aws'
import * as projections from 'lib/projections'
import elasticdump from './elasticdump'
import * as indices from './indices'

export default async function(name) {
  const s3 = new AWS.S3()

  await Promise.all(
    [...Object.values(projections), ...Object.values(indices)].map(async projection => {
      const index = projection.index
      const url = `${config.get('elasticsearch.url')}/${index}`
      const filename = `/tmp/${index}.json`

      if (existsSync(filename)) unlinkSync(filename)

      try {
        await elasticdump(url, filename, 'data')
        await s3
          .putObject({
            Bucket: 'krijoh-scryio',
            Body: createReadStream(filename),
            Key: `${name}/elasticsearch/${index}.json`,
          })
          .promise()
        unlinkSync(filename)
      } catch (err) {
        console.log(`Error dumping ${index}: ${err}`)
      }
    })
  )
}
