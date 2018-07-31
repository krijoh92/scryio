import {GcpMetaStore} from './gcp-store'

export default new GcpMetaStore({
  projectId: 'ddes-test',
  tableName: 'ddes-test-meta-store',
  endpoint: 'datastore:8081',
})
