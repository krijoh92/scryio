import * as services from '../services'

async function getStatus(name) {
  const service = services[name]

  if (!service) throw new Error(`Unknown service: ${name}`)

  const ready =
    typeof service.isReady === 'function' ? await service.isReady() : true

  return {name, ready}
}

export default async function(
  nameOrNames: string[] | string
): Promise<Array<{ready: boolean; name: string}> | {ready: boolean; name: string}> {
  if (Array.isArray(nameOrNames)) {
    return Promise.all(nameOrNames.map(getStatus))
  }
  return getStatus(nameOrNames)
}
