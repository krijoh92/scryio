async function requestOneTimePassword(emailOrSmsNumber) {
  const response = await fetch(
    `${localStorage.getItem('apiUrl') ||
      process.env.REACT_APP_BACKEND_URL}/auth/oneTimePassword`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({emailOrSmsNumber}),
    }
  )

  if (response.ok) {
    return await response.json()
  }

  throw new Error('Invalid response when requesting one-time password')
}

export default requestOneTimePassword
