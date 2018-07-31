import * as stores from 'lib/stores'

export default async function() {
  for (const store of Object.values(stores)) {
    await store.teardown()
  }
}
