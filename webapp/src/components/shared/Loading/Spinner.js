import React from 'react'
import {Spin} from 'antd'

const Spinner = ({center = true, size = 'large', style, ...rest}) => {
  const spinStyle = center
    ? {...style, display: 'flex', justifyContent: 'center'}
    : style
  return <Spin className="loading" size={size} style={spinStyle} {...rest} />
}

export default Spinner
