import React from 'react'

const TextLoading = ({style, lineHeight = 14, lines = 5}) => (
  <div style={style} className={'ant-card-loading-content loading'}>
    <p
      className={'ant-card-loading-block'}
      style={{width: lines === 1 ? '100%' : '94%', height: lineHeight}}
    />
    {lines > 1 && (
      <p>
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '28%'}}
        />
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '62%'}}
        />
      </p>
    )}
    {lines > 2 && (
      <p>
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '22%'}}
        />
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '66%'}}
        />
      </p>
    )}
    {lines > 3 && (
      <p>
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '56%'}}
        />
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '39%'}}
        />
      </p>
    )}
    {lines > 4 && (
      <p>
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '21%'}}
        />
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '15%'}}
        />
        <span
          className={'ant-card-loading-block'}
          style={{height: lineHeight, width: '40%'}}
        />
      </p>
    )}
  </div>
)

export default TextLoading
