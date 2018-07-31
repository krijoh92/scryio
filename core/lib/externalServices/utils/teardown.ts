import logger from 'lib/logger'
import * as services from '../services'
import getServiceStatus from './getServiceStatus'

export default async function teardown() {
  return Promise.all(
    Object.keys(services)
      .filter(name => typeof services[name].teardown === 'function')
      .map(async name => {
        const {ready} = (await getServiceStatus(name)) as {
          name: string;
          ready: boolean;
        }

        if (!ready) {
          logger.warn(
            `Ignoring teardown for service that was not ready: ${name}`
          )
          return Promise.resolve()
        }

        return services[name].teardown()
      })
  )
}
