import * as React from 'react'
import UserContext from './UserContext'

const withCurrentUser = Component => props => (
  <UserContext.Consumer>
    {context => <Component {...props} currentUser={context.user} />}
  </UserContext.Consumer>
)

export default withCurrentUser
