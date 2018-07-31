import builder from 'bodybuilder'
import {Collection} from 'lib/aggregates'
import {client as es} from 'lib/externalServices/elasticsearch'

export default {
    collections: async (obj, args, {username}) => {
        const body = builder().filter('term', 'username', username).build()
        const result = await es.search({index: 'collections', body})
        console.log(result.hits.hits)
        return Promise.all(result.hits.hits.map(({_id}) => Collection.getState(_id)))
    }
}
