#!/usr/bin/env node
import * as externalServices from 'lib/externalServices'

externalServices.setup().catch(error => {
  console.dir(error)
  process.exit(1)
})
