import {EventWithMetadata} from '@ddes/core'
import builder from 'bodybuilder'
import {Collection} from 'lib/aggregates'
import ElasticsearchProjection from './ElasticsearchProjection'

class CollectionsProjection extends ElasticsearchProjection {
  constructor(props?: any) {
    super({name: 'collections', aggregateClasses: {Collection}, ...props})
  }

  get mappings() {
    return {
      username: {type: 'keyword'},
      name: {type: 'keyword'},
    }
  }

  public processEvents = async events => {
    for (const event of events) {
      console.log(event)
      const {type, aggregateKey: id, properties} = event
      switch (type) {
        case 'Created': {
          await this.createCollection(id, properties)
          break
        }

        case 'Updated': {
          await this.updateCollection(id, properties)
          break
        }
      }
    }
  }

  private async createCollection(id: string, props: any) {
    return this.createDocument(id, this.collectionProps(props))
  }

  private async updateCollection(id: string, props: any) {
    return this.updateDocument(id, {doc: this.collectionProps(props)})
  }

  private collectionProps(props: any) {
    return {
      name: props.name,
      username: props.username,
    }
  }
}

export default new CollectionsProjection()
