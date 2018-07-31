import config from 'config'
import jwt from 'jsonwebtoken'

export function verify(token: string): any {
  return jwt.verify(token, config.get('auth.jwtSecret'), {
    issuer: 'scryio-core',
    audience: 'scryio-core',
  })
}

export function sign(payload): string {
  let expiresIn

  switch (payload.tokenType) {
    case 'refresh': {
      expiresIn = `${config.get('auth.refreshTokenLifetimeInHours')}h`
      break
    }
    case 'access': {
      expiresIn = `${config.get('auth.accessTokenLifetimeInSeconds')}s`
      break
    }
  }

  return jwt.sign(payload, config.get('auth.jwtSecret'), {
    audience: 'scryio-core',
    subject: payload.subject || payload.username,
    issuer: 'scryio-core',
    expiresIn,
  })
}
