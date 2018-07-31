import React from 'react'
import gql from 'graphql-tag'
import {Content, Grid, Loading, Query} from 'components/shared'
import {Card, Icon, Input} from 'antd'

const query = gql`
  query currentUser {
    me {
      username
      email
      collections {
        username
        name
        cards {
          name
        }
      }
    }
  }
`

const Profile = () => (
  <Content>
    <Query query={query}>
      {({loading, client, _data}) =>
        loading ? (
          <Loading />
        ) : (
          <Grid>
            <Card title={<h3>Your info</h3>}>
              <p>Username: {_data('me.username')}</p>
              <p>email: {_data('me.email')}</p>
            </Card>
            <Card title={<h3>Your data</h3>}>
              {_data('me.collections').map(collection => (
                <p key={`${collection.username}.${collection.name}`}>
                  {collection.name}: {collection.cards.length} cards
                </p>
              ))}
            </Card>
          </Grid>
        )
      }
    </Query>
  </Content>
)

export default Profile
