#!/usr/bin/env node
// import {System} from "lib/aggregates";
// import isFalsy from "lib/isFalsy";
import seed from './seedData'
import logger from 'lib/logger'
import config from 'config'

async function loadDataset(name) {
  //   if (isFalsy(name)) return;

  //   logger.info(`Loading dataset '${name}'`);
  //   const system = await System.load();
  //   await system.loadDataset(name);
  console.log('Seeding from seedData')
  await seed()

  // console.log("No datasets yet");
}

if (!module.parent) {
  loadDataset(process.argv[2]).catch(error => {
    console.log(error)
    process.exit(1)
  })
}
