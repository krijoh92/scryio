import {makeExecutableSchema} from 'graphql-tools'

import schema from './schema'
import * as resolvers from './resolvers'
import * as scalars from './scalars'

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: {...resolvers, ...scalars},
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

export default executableSchema
