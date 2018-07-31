import {Projector} from '@ddes/core'
import config from 'config'
import logger from 'lib/logger'
import * as allProjections from 'lib/projections'
import * as stores from 'lib/stores'

function usage(errorMessage?: string) {
  if (errorMessage) {
    console.error(errorMessage)
  }

  console.log(
    'Usage: services/projector storeName:chronologicalGroup projectionA [projectionB ...]'
  )

  process.exit(1)
}

async function main() {
  if (process.argv.length < 4) {
    usage()
  }

  const [storeName, chronologicalGroup = 'default'] = process.argv[2].split(
    ':'
  )
  const eventStore = stores[storeName]

  if (!eventStore) {
    usage(`Unknown store '${storeName}'`)
  }

  const filter = process.argv.slice(3)
  const projections = Object.values(allProjections).filter(p =>
    filter.includes(p.name)
  )

  if (projections.length === 0) {
    usage('No valid projections provided')
  }

  const maxQueueSize = 5000
  const projector = new Projector(projections, {
    eventStore,
    chronologicalGroup,
    maxQueueSize,
  })

  projector.start()

  return `Projecting from ${storeName}[${chronologicalGroup}] to projections: ${projections.map(
    p => p.name
  )}`
}

if (!module.parent) {
  process.on('unhandledRejection', reason => {
    logger.error(reason)
    process.exit(1)
  })

  main()
    .then(logger.info)
    .catch(error => {
      logger.error(error)
      process.exit(1)
    })
}
