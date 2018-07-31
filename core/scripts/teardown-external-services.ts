#!/usr/bin/env node
import * as externalServices from 'lib/externalServices'

externalServices
  .teardown()
  .catch(error => {
    console.dir(error)
    process.exit(1)
  })
  .then(() => process.exit(0))
