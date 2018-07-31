import config from 'config'
import {formatDate} from 'lib/formatters'
import logger from 'lib/logger'
import * as projections from 'lib/projections'
import * as indices from './indices'
import {meta} from 'lib/stores'

export default async function() {
  const startsAt = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
  logger.info(`Creating GcpMetaStore: ${meta.tableName} (startsAt: ${startsAt})`)

  await meta.setup()
  for await (const projection of [
    projections.collections,
    projections.sets,
    projections.users,
    indices.cards,
  ]) {
    logger.info('Setting up projection:')
    logger.info(projection.index)
    await projection.setup()
  }
}
