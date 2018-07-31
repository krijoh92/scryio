import bodybuilder from 'bodybuilder'
import client from './client'

async function search(index = '_all', builder?: any, options?: any) {
  const body = builder && builder(bodybuilder()).build()
  return await client.search({index, ...options, body})
}

export default search
