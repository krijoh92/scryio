import {elasticsearch} from 'lib/externalServices'

async function isReady(): Promise<boolean> {
  try {
    return await elasticsearch.client.ping({})
  } catch (error) {
    return false
  }
}

export default isReady
