import {Aggregate, AggregateStatic, KeySchema} from '@ddes/core'
import {main as mainStore, snap as snapStore} from './stores'
import uuid from 'uuid/v4'
import {fromJS} from 'immutable'
import {deserialize} from './CompositeId'

class ImmutableAggregate extends Aggregate {
  public static eventStore = mainStore
  public static snapshotStore = snapStore
  public static snapshotsFrequency = 100

  public static keySchema = new KeySchema([
    {
      name: 'id',
      value: ({id}: {id: any}) => id || uuid(),
    },
  ])

  public static async all<T extends ImmutableAggregate>(this: AggregateStatic<T>): Promise<T[]> {
    const aggs = []
    for await (const agg of this.scanInstances()) {
      aggs.push(agg)
    }
    return aggs
  }

  public static async load64<T extends ImmutableAggregate>(
    this: AggregateStatic<T>,
    key: string
  ): Promise<T> {
    return this.load(deserialize(key))
  }

  public static async getState64<T extends ImmutableAggregate>(
    this: AggregateStatic<T>,
    key: string
  ): Promise<{} | any> {
    return this.getState(deserialize(key))
  }

  public convertFromInternalState(state: any) {
    return state && state.toJS()
  }

  public convertToInternalState(js: any) {
    return fromJS(js)
  }

  public get immutableState() {
    return this.internalState
  }

  public async loadEvents() {
    const {commits} = this.eventStore.queryAggregateCommits(this.type, this.key, {
      maxVersion: this.version,
    })
    let allEvents = []
    for await (const commit of commits) {
      allEvents = allEvents.concat(
        commit.events.map(event => ({
          id: commit.sortKey,
          type: event.type,
          timestamp: new Date(commit.timestamp),
          properties: event.properties,
        }))
      )
    }
    return allEvents
  }
}

export default ImmutableAggregate
