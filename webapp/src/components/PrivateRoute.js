import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {UserContext} from 'components/shared'

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
    <UserContext.Consumer>
      {({user}) => {
        return (
          <Route
            {...rest}
            render={props =>
              user ? (
                <Component {...props} />
              ) : (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: {from: props.location},
                  }}
                />
              )
            }
          />
        )
      }}
    </UserContext.Consumer>
  )
}

export default PrivateRoute
