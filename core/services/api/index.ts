import {execute, subscribe} from 'graphql'
import {logger} from 'lib'
import {executableSchema} from 'lib/graphql'
import { verify } from 'lib/jwtHelper'
import {SubscriptionServer} from 'subscriptions-transport-ws'
import server from './server'

export default server

async function start() {
  const {PORT = 3000} = process.env
  // await elasticsearch.client.ping() <-- Wait for elasticsearch to be ready
  const serverInstance = server.listen(PORT)

  logger.info(`Listening on port ${PORT}`)

  return new SubscriptionServer({
    execute,
    subscribe,
    keepAlive: 10000,
    schema: executableSchema,
    onConnect: connectionParams => {

      if (connectionParams.accessToken) {
        const decodedToken = verify(connectionParams.accessToken)

        if (decodedToken.tokenType !== 'access') {
          throw new Error('Not an access token')
        }

        return decodedToken
      }

      throw new Error('Missing accessToken')
    },
    onOperation: (msg, params) => {
      return new Promise(resolve => {
        const obj = {
          ...params,
          formatResponse: value => {
            if (value.errors) {
              logger.error(value.errors)
            }
            return value
          },
        }
        resolve(obj)
      })
    },
  }, {
    server: serverInstance,
    path: '/graphqlws'
  })
}

if (!module.parent) {
  process.on('unhandledRejection', (reason, p) => {
    throw new Error(`Unhandled Rejection at: ${p} reason: ${reason}`)
  })
  start().catch(err => {
    logger.error(err)
    process.exit(1)
  })
}
