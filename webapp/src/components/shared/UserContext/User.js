import * as React from 'react'
import {globalSignOut} from 'lib/auth'
import {wsClient} from 'lib/graphql/client'
import UserContext from './UserContext'

class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
      signIn: this.login,
      signOut: this.logout,
    }
  }

  componentWillReceiveProps(props) {
    if ('user' in props) {
      this.setState(state => {
        if (state !== props.user) {
          return {user: props.user}
        }
      })
    }
  }

  reset = () => {
    wsClient.close(true, true)
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    this.props.client.resetStore()
  }

  login = token => {
    this.logout()
    this.refreshToken = token
  }

  logout = async global => {
    if (global) globalSignOut(this.refreshToken)
    this.reset()
  }

  get refreshToken() {
    return localStorage.getItem('refreshToken')
  }

  set refreshToken(token) {
    localStorage.setItem('refreshToken', token)
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default User
