import {EventWithMetadata, KeySchema, retryCommand} from '@ddes/core'
import ImmutableAggregate from '../../ImmutableAggregate'
import {validate} from '../../joi'
import reducer from './reducer'
import * as schema from './schema'

class Collection extends ImmutableAggregate {
  public static stateReducer = reducer
  public static keySchema = new KeySchema(['username', 'name'])

  @validate(schema.create)
  @retryCommand()
  public async create(props: {username: string; name: string; committer?: string}) {
    return await this.commit({
      type: 'Created',
      properties: {
        committer: 'system',
        ...props,
      },
    })
  }

  @retryCommand()
  public async addCards(props: {cards: string[]; committer?: string}) {
    return await this.commit({
      type: 'CardsAdded',
      properties: {
        committer: 'system',
        ...props,
      },
    })
  }

  @retryCommand()
  public async resetCollection(props: {committer?: string}) {
    return await this.commit({
      type: 'CollectionReset',
      properties: {committer: 'system', ...props},
    })
  }
}

export default Collection
