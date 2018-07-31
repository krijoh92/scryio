import React from 'react'
import {Flex} from 'components/shared'

const ListLoading = ({style, rows = 1, unitRows = 2, image}) => {
  const Row = ({bordered}) => (
    <div
      style={{
        ...style,
        ...{
          borderBottom: bordered ? 'solid 1px #E8E8E8' : '',
          padding: '10px 0px',
          marginBottom: 0,
        },
      }}
      className="loading"
    >
      <Flex justify="start" align="center" style={{width: '100%'}}>
        <div>
          {image && <div className={'ant-card-loading-block'} style={image} />}
        </div>
        <div style={{width: '100%'}}>
          <Flex align="center" justify="space-between">
            <div className={'ant-card-loading-block'} style={{width: '20%'}} />
            <div className={'ant-card-loading-block'} style={{width: '30%'}} />
          </Flex>
          {unitRows > 0 && (
            <div>
              <div
                className={'ant-card-loading-block'}
                style={{width: '40%'}}
              />
            </div>
          )}
          {unitRows > 1 && (
            <div>
              <div
                className={'ant-card-loading-block'}
                style={{width: '30%'}}
              />
            </div>
          )}
          {unitRows > 3 && (
            <div>
              <div
                className={'ant-card-loading-block'}
                style={{width: '60%'}}
              />
            </div>
          )}
          {unitRows > 4 && (
            <div>
              <div
                className={'ant-card-loading-block'}
                style={{width: '25%'}}
              />
            </div>
          )}
          {unitRows > 5 && (
            <div>
              <div
                className={'ant-card-loading-block'}
                style={{width: '30%'}}
              />
            </div>
          )}
        </div>
      </Flex>
    </div>
  )

  const list = []
  for (let i = 1; i <= rows; i++) {
    list.push(<Row key={i} bordered={i !== rows} />)
  }

  return list
}

export default ListLoading
