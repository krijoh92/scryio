import {EventWithMetadata} from '@ddes/core'
import config from 'config'
import {fromJS} from 'immutable'

const defaultState = fromJS({
  username: null,
  name: null,
  cards: [],
})

function reducer(
  state: any,
  {type, timestamp, properties: {committer, ...properties}}: EventWithMetadata
): any {
  const timestamps = {
    created: {
      createdAt: timestamp,
      createdBy: committer,
    },
    updated: {
      updatedAt: timestamp,
      updatedBy: committer,
    },
  }

  switch (type) {
    case 'Created': {
      return defaultState.merge(
        fromJS({
          ...properties,
          ...timestamps.created,
          ...timestamps.updated,
        })
      )
    }

    case 'CardsAdded': {
      console.log('adding cards')
      console.log(properties.cards)

      return state
        .update('cards', cards => cards.concat(properties.cards))
        .merge(fromJS({...timestamps.updated}))
    }

    case 'CollectionReset': {
      return state.update('cards', _ => []).merge(fromJS({...timestamps.updated}))
    }

    default:
      return state
  }
}

export default reducer
