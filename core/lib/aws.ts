import AWS from 'aws-sdk'
import config from 'config'

AWS.config.update(config.get('aws'))

export default AWS
