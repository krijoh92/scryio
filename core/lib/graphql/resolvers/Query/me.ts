import {user} from 'lib/graphql/helpers'

async function me(obj, args, {username}) {
  return user(username)
}

export default me
