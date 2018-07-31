import {User} from 'lib/aggregates'

export default async function(username) {
    return username && (await User.getState(username))
}
