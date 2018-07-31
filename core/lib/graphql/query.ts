import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloClient, ApolloQueryResult} from 'apollo-client'
import {SchemaLink} from 'apollo-link-schema'
import config from 'config'
import {DocumentNode} from 'graphql'
import schema from './executableSchema'

export default function({
  query,
  variables,
  context = {},
}: {
  query: DocumentNode
  variables?: any
  context?: any
}): Promise<ApolloQueryResult<any>> {
  const client = new ApolloClient({
    ssrMode: true,
    link: new SchemaLink({schema, context}),
    cache: new InMemoryCache(),
  })

  return client.query({query, variables})
}
