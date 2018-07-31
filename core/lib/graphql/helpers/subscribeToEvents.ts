import {EventSubscriber} from '@ddes/event-streaming'
import config from 'config'

function subscribeToEvents(...events) {
  const digest = Buffer.from(`ess:${config.get('eventStreamServer.secret')}`).toString('base64')

  return new EventSubscriber({
    wsUrl: config.get('eventStreamServer.url'),
    events,
    headers: {
      authorization: `Basic ${digest}`,
    },
  })
}

export default subscribeToEvents
