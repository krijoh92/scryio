import * as React from 'react'
import gql from 'graphql-tag'
import {Query, Loading} from 'components/shared'
import User from './User'

const query = gql`
  query currentUser {
    me {
      username
      email
    }
  }
`

const Provider = ({children}) => {
  return (
    <Query query={query}>
      {({loading, client, _data}) =>
        loading ? (
          <Loading />
        ) : (
          <User client={client} user={_data('me')}>
            {children}
          </User>
        )
      }
    </Query>
  )
}

export default Provider
