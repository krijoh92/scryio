async function globalSignOut(refreshToken) {
  if (!refreshToken) throw new Error('No refresh token')

  const response = await fetch(
    `${localStorage.getItem('apiUrl') ||
      process.env.REACT_APP_BACKEND_URL}/auth/invalidateRefreshTokens`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({refreshToken}),
    }
  )

  if (!response.ok) {
    throw new Error('Invalid response when attempting global sign-out.')
  }
}

export default globalSignOut
