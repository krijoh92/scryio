import config from 'config'
import crypto from 'crypto'

const alg = config.get('crypto.alg') as string
const secret = config.get('crypto.secret') as string

export function encryptPassword(password: string): string {
    const cipher = crypto.createCipher(alg, secret)
    let crypted = cipher.update(password, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}

export function validatePassord(password: string, encryptedPassword: string): boolean {
    const decipher = crypto.createDecipher(alg, secret)
    let dec = decipher.update(encryptedPassword, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec === password
}
