import * as React from 'react'

export default React.createContext({
  user: null,
  signOut: () => null,
  signIn: () => null,
})
