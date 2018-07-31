#!/usr/bin/env node

import {waitFor} from 'lib/externalServices'

async function waitForServices(services, opts) {
  await waitFor(services, opts) //
}

if (!module.parent) {
  waitForServices(process.argv.slice(2), {
    timeout: process.env.TIMEOUT,
    spacing: process.env.SPACING,
  }).catch(error => {
    console.log(error)
    process.exit(1)
  })
}
