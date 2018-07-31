const path = require('path')
const defer = require('config/defer').deferConfig
let aws

try {
  aws = require('/run/secrets/aws-config.json')
} catch (_) {
  aws = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  }
}

const namespace = defer(config => {
  if (!config.deploymentName) {
    throw new Error('Missing deploymentName configuration')
  }
  return config.deploymentName
})

module.exports = {
  namespace,
  aws,
  rootPath: path.resolve(__dirname, '../'),

  webappUrl: defer(config => `https://${config.stackDnsName}-web.${config.dnsDomain}`),

  ddes: {
    tableName: namespace,
  },

  s3BucketName: namespace,
}
