import {User} from 'lib/aggregates'

export default async function(_, {username, email, password}) {
  const newUser = await User.create({username, email, password})

  return newUser.state
}
