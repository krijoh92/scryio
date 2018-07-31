import React from 'react'
import styled from 'styled-components'
import {Subscription, withApollo, graphql} from 'react-apollo'
import {Grid} from 'components/shared'
import gql from 'graphql-tag'

const CARDS_SUBSCRIPTION = gql`
  subscription cardsAddedToCollection {
    cardsAddedToCollection {
      id
      name
      thumbnail
    }
  }
`

const CardGrid = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(186px, 1fr));
  list-style: none;
  padding: 0px;
  gap: 20px 20px;
`

const Card = ({thumbnail}) => (
  <div
    style={{
      background: `url(${thumbnail})`,
      display: 'block',
      backgroundSize: 'cover',
      height: 260,
      width: 186,
    }}
  />
)

class LiveScan extends React.Component {
  state = {
    cards: [],
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.data.loading) {
      if (this.unsubscribe) {
        this.unsubscribe()
      }

      this.unsubscribe = this.props.data.subscribeToMore({
        document: CARDS_SUBSCRIPTION,
        updateQuery: (prev, {subscriptionData: {data}}) => {
          this.setState(({cards}) => ({
            cards: cards.concat(data.cardsAddedToCollection),
          }))
        },
      })
    }
  }

  render() {
    const {cards} = this.state
    return (
      <div style={{padding: 20}}>
        <CardGrid>
          {cards.map(({id, thumbnail}) => (
            <Card key={id} thumbnail={thumbnail} />
          ))}
        </CardGrid>
      </div>
    )
  }
}

export default graphql(gql`
  query MeQuery {
    me {
      username
    }
  }
`)(LiveScan)
