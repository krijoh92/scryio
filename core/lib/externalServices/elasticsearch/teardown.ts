import * as projections from 'lib/projections'
import * as indices from './indices'

export default async function(): Promise<void> {
  for (const index of Object.values(indices)) {
    await index.teardown()
  }

  for (const projection of Object.values(projections)) {
    await projection.teardown()
  }
}
