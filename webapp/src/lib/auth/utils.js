export function decodeToken(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  return JSON.parse(window.atob(base64))
}

export function tokenExpired(token, timeMarginInSeconds = 3) {
  const {exp} = decodeToken(token)
  const now = parseInt(Date.now() / 1000, 10)
  return now + timeMarginInSeconds > exp
}
