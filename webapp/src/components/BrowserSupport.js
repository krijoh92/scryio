import * as React from 'react'
import {detect} from 'detect-browser'
import {message} from 'antd'

const Warning = () => (
  <span>
    You are using an unsupported browser. Please install{' '}
    <a href="https://www.google.com/chrome/">Google Chrome</a>
  </span>
)

const BrowserSupport = ({children}) => {
  const {name} = detect()
  const isSupported = ['chrome', 'safari', 'ios'].includes(name)

  if (!isSupported) message.warning(<Warning />, 0)
  return children
}

export default BrowserSupport
