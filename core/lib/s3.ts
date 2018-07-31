import config from 'config'
import AWS from './aws'
import logger from './logger'

const s3 = new AWS.S3()
const Bucket = config.get('s3BucketName') as string

export function s3ExtractBucketKey(url: string) {
  const regex = /https?:\/\/([a-z0-9.:_-]+)\/([a-z0-9_-]+)\/(.+)$/
  // tslint:disable-next-line
  const [, , Bucket, Key] = regex.exec(url)
  return {Bucket, Key}
}

export async function s3Exists(Key: string, IfModifiedSince: any) {
  const options: {Key: string; Bucket: string; IfModifiedSince?: any} = {Key, Bucket}
  if (IfModifiedSince) options.IfModifiedSince = IfModifiedSince
  try {
    const exists = await s3.headObject(options).promise()
    return !!exists
  } catch (err) {
    return false
  }
}

export function s3Url(Key: string) {
  const host = `https://s3-${config.get('aws.region')}.amazonaws.com`
  return [host, Bucket, Key].join('/')
}

export function s3Fetch({Key}: {Key: string}) {
  try {
    return s3.getObject({Key, Bucket}).promise()
  } catch (err) {
    logger.error(`Unable to get object from S3 for key ${Key} `)
    throw err
  }
}

export function s3Stream({Key}: {Key: string}) {
  try {
    return s3.getObject({Key, Bucket}).createReadStream()
  } catch (err) {
    logger.error(`Unable to get stream from S3 for key ${Key}`)
    throw err
  }
}

export function s3Delete({Key}: {Key: string}) {
  try {
    return s3.deleteObject({Key, Bucket}).promise()
  } catch (err) {
    logger.error(`Unable to delete S3 object with ${Key}`)
    throw err
  }
}

// tslint:disable-next-line
export async function* s3EachObject({Bucket, Prefix}: {Bucket: string; Prefix: string}) {
  let Marker
  do {
    const result = await s3.listObjects({Bucket, Marker, Prefix}).promise()
    for (const obj of result.Contents) {
      yield obj
    }
    Marker = result.Marker
  } while (Marker)
}

// tslint:disable-next-line
export async function s3DeleteRecursive({Bucket, Prefix}) {
  const deleteArr = []
  const objects = s3EachObject({Bucket, Prefix})
  for await (const {Key} of objects) {
    deleteArr.push(Key)
  }

  if (!deleteArr.length) return

  if (deleteArr.length <= 1000) {
    const Objects = deleteArr.map(Key => ({Key}))
    return await s3.deleteObjects({Bucket, Delete: {Objects}}).promise()
  }

  return await Promise.all(deleteArr.map(Key => s3.deleteObject({Bucket, Key}).promise()))
}
