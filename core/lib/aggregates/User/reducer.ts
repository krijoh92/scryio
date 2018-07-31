import {EventWithMetadata} from '@ddes/core'
import config from 'config'
import {addSeconds, isFuture} from 'date-fns'
import {fromJS} from 'immutable'

const defaultState = fromJS({
  email: null,
  password: null,
  collections: [],
  tokensInvalidatedTimestamp: null,
  generateRefreshTokenFailures: [],
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

    case 'Updated': {
      return state.merge({...properties, ...timestamps.updated})
    }

    case 'GenerateRefreshTokenFailed': {
      const {oneTimePassword} = properties

      return state.update('generateRefreshTokenFailures', list =>
        list
          .push({oneTimePassword, timestamp})
          .filter(({timestamp: time}) =>
            isFuture(
              addSeconds(
                time,
                config.get(
                  'auth.maxGenerateRefreshTokenFailuresIntervalInSeconds'
                )
              )
            )
          )
      )
    }

    case 'RefreshTokenGenerated': {
      return state.set('refreshToken', properties.refreshToken)
    }

    case 'AccessTokenGenerated': {
      return state.set('accessToken', properties.accessToken)
    }

    case 'RefreshTokensInvalidated': {
      // Set the a timestamp to be used by code validating refresh tokens
      // (the refresh token should be issued after this timestamp)
      return state.set('tokensInvalidatedTimestamp', timestamp)
    }

    default:
      return state
  }
}

export default reducer
