#!/usr/bin/env node
import {Collection, User} from 'lib/aggregates'

async function usersAndCollections() {
  const users: Array<{username: string, email: string, password: string}> = [
    {username: 'spiff', email: 'spiffern@gmail.com', password: '12345'},
    {username: 'larsla', email: 'larslalars@gmail.com', password: '12345'},
  ]

  users.forEach(async (user) => {
      await User.create(user)
      await Collection.create({username: user.username, name: 'Unlisted'})
  })
}

export default usersAndCollections

if (!module.parent) {
    usersAndCollections().catch(error => {
        console.log(error)
        process.exit(1)
    })
}
