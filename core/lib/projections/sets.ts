import {EventWithMetadata} from '@ddes/core'
import builder from 'bodybuilder'
import {Set} from 'lib/aggregates'
import ElasticsearchProjection from './ElasticsearchProjection'

class SetsProjection extends ElasticsearchProjection {
  constructor(props?: any) {
    super({name: 'sets', aggregateClasses: {Set}, ...props})
  }

  get mappings() {
    return {
        name: {type: 'keyword'},
        code: {type: 'keyword'},
        releaseDate: {type: 'date'},
        type: {type: 'keyword'},
        block: {type: 'keyword'},
        cardCount: {type: 'integer'}
    }
  }

  public processEvents = async events => {
    for (const event of events) {
      const {type, aggregateKey: id, properties} = event
      switch (type) {
        case 'Created': {
          await this.createSet(id, properties)
          break
        }

        case 'Updated': {
          await this.updateSet(id, properties)
          break
        }
      }
    }
  }

  private async createSet(id: string, props: any) {
    return this.createDocument(id, this.setProps(props))
  }

  private async updateSet(id: string, props: any) {
    return this.updateDocument(id, {doc: this.setProps(props)})
  }

  private setProps(props: any) {
    return {
        name: props.name,
        code: props.code,
        releaseDate: props.releaseDate,
        type: props.type,
        block: props.block,
        cardCount: props.cardCount
    }
  }
}

export default new SetsProjection()
