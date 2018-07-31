import builder from 'bodybuilder'
import {Collection} from 'lib/aggregates'
import {client as es} from 'lib/externalServices/elasticsearch'

export default {
    id: ({username, name}, args) => {
        return `${username}.${name}`
    },
    cards: async ({cards}) => {
        const docs = []
        console.log(cards)
        for await (const id of cards) {
            const card = await es.get({index: 'cards', id, type: 'doc'})
            docs.push(card._source)
        }

        return docs
    }
}
