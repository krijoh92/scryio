import {EventWithMetadata} from '@ddes/core'
import config from 'config'
import {fromJS} from 'immutable'

const defaultState = fromJS({
  name: null,
  code: null,
  releaseDate: null,
  type: null,
  block: null,
  cardCount: 0
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

    default:
      return state
  }
}

export default reducer
