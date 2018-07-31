import * as React from 'react'
import TextLoading from './TextLoading'
import ListLoading from './ListLoading'
import Spinner from './Spinner'

const Loading = ({type, ...props}) => {
  switch (type) {
    case 'text':
      return <TextLoading {...props} />
    case 'list':
      return <ListLoading {...props} />
    default:
      return <Spinner {...props} />
  }
}

export default Loading
