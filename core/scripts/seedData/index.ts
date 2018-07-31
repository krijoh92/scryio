#!/usr/bin/env node
import logger from 'lib/logger'
import mtgCards from './mtgCards'
import mtgSets from './mtgSets'
import usersAndCollections from './usersAndCollections'

async function seedData() {
  logger.info('Seeding users')
  await usersAndCollections()

  logger.info('Seeding mtg sets')
  await mtgSets()

  logger.info('Seeding mtg cards')
  await mtgCards()
}

export default seedData

if (!module.parent) {
  seedData().catch(error => {
    console.log(error)
    process.exit(1)
  })
}
