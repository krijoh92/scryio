import {GcpSnapshotStore} from './gcp-store'

export default new GcpSnapshotStore({
  projectId: 'ddes-test',
  tableName: 'ddes-test-snap-store',
  endpoint: 'datastore:8081',
})
