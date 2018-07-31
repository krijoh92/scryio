import { Collection } from 'lib/aggregates'
import {client as es} from 'lib/externalServices/elasticsearch'
import { subscribeToEvents } from 'lib/graphql/helpers'
import waitForElasticsearchProjection from 'lib/projections/waitForElasticsearchProjection'

export default {
    subscribe: (_, __, {username}) =>
        subscribeToEvents({
            aggregateType: 'Collection',
            aggregateKey: {
                regexp: `^${username}.`
            },
            type: ['CardsAdded']
        }),
    async resolve({properties: {cards}}) {
        const docs = []
        for await(const id of cards) {
            const card = await es.get({index: 'cards', id, type: 'doc'})
            docs.push(card._source)
        }

        return docs
    }
}
