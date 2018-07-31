import config from 'config'
import AWS from 'lib/aws'

const ddb = new AWS.DynamoDB()

export default async function() {
  try {
    const {
      Table: {TableStatus},
    } = await ddb
      .describeTable({TableName: config.get('ddes.tableName')})
      .promise()

    switch (TableStatus) {
      case 'ACTIVE':
        return true
      default:
        return false
    }
  } catch (error) {
    if (error.code !== 'ResourceNotFoundException') throw error
  }

  return false
}
