async function obtainRefreshToken(email, password) {
  const response = await fetch(
    `${localStorage.getItem('apiUrl') ||
      process.env.REACT_APP_BACKEND_URL}/auth/refreshToken`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    }
  )

  if (response.ok) {
    const {refreshToken} = await response.json()
    return refreshToken
  }

  throw new Error('Invalid response when requesting refresh token')
}

export default obtainRefreshToken
