import {ApolloClient} from 'apollo-client'
import {setContext} from 'apollo-link-context'
import {onError} from 'apollo-link-error'
import {WebSocketLink} from 'apollo-link-ws'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {obtainAccessToken} from 'lib/auth'
import {SubscriptionClient} from 'subscriptions-transport-ws'

const apiUrl =
  localStorage.getItem('apiGraphqlWsUrl') ||
  process.env.REACT_APP_API_GRAPHQL_WS_URL

export const wsClient = new SubscriptionClient(apiUrl, {
  reconnect: true,
  connectionParams: () => ({
    accessToken: localStorage.getItem('accessToken'),
  }),
})
const wsLink = new WebSocketLink(wsClient)

const authLink = setContext(async (_, {headers}) => {
  const token = await obtainAccessToken()
  // Uncomment to simulate slow network.
  // await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))

  const authorization = token ? {authorization: `Bearer ${token}`} : null
  return {
    token,
    headers: {...headers, ...authorization},
  }
})

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    console.warn('[GraphQL errors]:', graphQLErrors)
  }

  if (networkError) {
    console.warn('[NetworkError]:', networkError)
    // if (networkError.statusCode === 401) {
    //   signOut()
    // }
  }
})

const link = errorLink.concat(authLink).concat(wsLink)

const cache = new InMemoryCache({
  addTypeName: true,
})

const client = new ApolloClient({
  link,
  cache,
  queryDeduplication: true,
  connectToDevTools: true,
})

// possible fix for stuck queries when reconnecting to ws
// wsClient.onReconnected(client.reFetchObservableQueries)

export default client
