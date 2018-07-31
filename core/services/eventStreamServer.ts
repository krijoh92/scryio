import {EventStreamer} from '@ddes/event-streaming'
import config from 'config'
import {main, meta} from 'lib/stores'

process.on('unhandledRejection', (reason, p) => {
  throw new Error(`Unhandled rejection at: ${p} reason: ${reason}`)
})

const digest = Buffer.from(
  `ess:${config.get('eventStreamServer.secret')}`
).toString('base64')

const server = new EventStreamer({
  port: parseInt(process.env.PORT, 10) || 80,
  eventStore: main,
  authenticateClient: ({req}) =>
    req.headers.authorization === `Basic ${digest}`,
})
