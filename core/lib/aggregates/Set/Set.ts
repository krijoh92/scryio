import {EventWithMetadata, KeySchema, retryCommand} from '@ddes/core'
import ImmutableAggregate from 'lib/ImmutableAggregate'
import { validate } from 'lib/joi'
import reducer from './reducer'
import * as schema from './schema'

class Set extends ImmutableAggregate {
    public static stateReducer = reducer
    public static keySchema = new KeySchema(['code'])

    @validate(schema.create)
    @retryCommand()
    public async create(props: {
        name: string,
        code: string,
        type: string,
        releaseDate?: Date,
        block?: string,
        blockCode?: string,
        parentCode?: string,
        iconSvg: string,
        cardCount: number
    }) {
      return await this.commit({
        type: 'Created',
        properties: {
          committer: 'system',
          ...props,
        },
      })
    }
}

export default Set
