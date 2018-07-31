import builder from 'bodybuilder'
import Router from 'koa-router'
import {User} from 'lib/aggregates'
import {client as es, search} from 'lib/externalServices/elasticsearch'
import {verify} from 'lib/jwtHelper'
import logger from 'lib/logger'

const auth = new Router()

async function getUserFromEmail(email) {
  const body = builder()
    .query('match', 'email', email)
    .build()

  const searchResult = await es.search({index: 'users', size: 1, body})

  if (searchResult.hits.total === 0) {
    logger.warn(`No user found with email: ${email}`)
    return null
  }

  const username = searchResult.hits.hits[0]._id
  const user = await User.load(username)

  return user
}

auth.post('/refreshToken', async ctx => {
  const {email, password} = ctx.request.body
  const user = await getUserFromEmail(email)

  if (!user) {
    ctx.status = 401
    return
  }

  let refreshToken
  try {
    await user.generateRefreshToken(password, ctx.request.headers)
    refreshToken = user.state.refreshToken
  } catch (e) {
    logger.error(e)
    ctx.throw(401)
  }

  ctx.body = {refreshToken}
  ctx.status = 201
})

auth.post('/accessToken', async ctx => {
  const {refreshToken} = ctx.request.body
  const {username} = verify(refreshToken)
  const user = await User.load(username)

  let accessToken

  try {
    await user.generateAccessToken(refreshToken, ctx.request.headers)
    accessToken = user.state.accessToken
  } catch (error) {
    console.dir({error}, {showHidden: false, depth: null})
    ctx.throw(401)
  }

  ctx.body = {accessToken}
  ctx.status = 201
})

export default auth
