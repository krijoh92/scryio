import {GcpEventStore} from './gcp-store'

export default new GcpEventStore({
  projectId: 'ddes-test',
  tableName: 'ddes-test-main-store',
  endpoint: 'datastore:8081',
})
