import * as React from 'react'
import {Query} from 'react-apollo'
import {get} from 'lodash'

export default ({children, ...props}) => {
  return (
    <Query {...props}>
      {result => {
        const _data = (prop, defaultValue) => get(result.data, prop, defaultValue)
        return children({...result, _data, getData: _data})
      }}
    </Query>
  )
}
