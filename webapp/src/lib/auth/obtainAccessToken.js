import {tokenExpired, decodeToken} from './utils'

async function obtainAccessToken({forceNew = false} = {}) {
  const storedAccessToken = localStorage.getItem('accessToken')

  if (!forceNew && storedAccessToken && !tokenExpired(storedAccessToken, 30)) {
    return storedAccessToken
  }

  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) {
    // throw new Error('No refresh token')
    return
  }

  const response = await fetch(
    `${localStorage.getItem('apiUrl') || process.env.REACT_APP_BACKEND_URL}/auth/accessToken`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({refreshToken}),
    }
  )

  if (response.ok) {
    const {accessToken} = await response.json()
    localStorage.setItem('accessToken', accessToken)

    const {userId, accountId, permissions} = decodeToken(accessToken)
    localStorage.setItem('sentryUser', JSON.stringify({userId, accountId, permissions}))

    return accessToken
  } else if (response.status === 401) {
    return null
  }

  throw new Error(`Invalid response when requesting accessToken: ${response.statusText}`)
}

export default obtainAccessToken
