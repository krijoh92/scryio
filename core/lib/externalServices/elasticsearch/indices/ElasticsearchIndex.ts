import {Projection} from '@ddes/core'
import {client as es} from 'lib/externalServices/elasticsearch'
import logger from 'lib/logger'
import {meta} from 'lib/stores'

class ElasticsearchIndex {
  protected mappings: {}
  protected name: string
  protected logger: any

  constructor(props) {
    this.name = props.name
    this.logger = logger
  }

  get index() {
    return this.name
  }

  get client() {
    return es
  }

  public async setup() {
    const {index, client} = this
    this.logger.info(`Creating index ${index}`)
    const mappings = {doc: {properties: this.mappings}}
    const result = await client.indices.create({
      index,
      body: {mappings},
      ignore: [400],
    })
    if (
      result.error &&
      result.error.type !== 'resource_already_exists_exception'
    ) {
      throw result.error
    }
  }

  public async teardown() {
    const {index, client} = this
    this.logger.info(`Destroying index ${index}`)
    return await client.indices.delete({index, ignore: [400, 404]})
  }

  public async reindex() {
    const mappings = {doc: {properties: this.mappings}}
    const {index, client} = this
    const tempIndex = `${index}_temp`

    try {
      await client.indices.create({
        index: tempIndex,
        body: {mappings},
      })
      await client.reindex({
        refresh: true,
        body: {
          source: {index},
          dest: {index: tempIndex},
        },
      })
      await client.indices.delete({index})
      await client.indices.create({index, body: {mappings}})
      await client.reindex({body: {source: {index: tempIndex}, dest: {index}}})
    } catch (err) {
      console.error(err)
    } finally {
      await client.indices.delete({index: tempIndex, ignore: [404]})
    }
  }

  protected async createDocument(id: string, body: any) {
    const {index, client} = this
    return await client.index({
      index,
      id,
      body,
      type: 'doc',
    })
  }

  protected async updateDocument(id: string, body: any) {
    const {index, client} = this
    return await client.update({
      index,
      id,
      body,
      type: 'doc',
      retryOnConflict: 5,
      ignore: [404],
    })
  }

  protected async deleteDocument(id: string) {
    const {index, client} = this
    return await client.delete({
      index,
      id,
      type: 'doc',
      ignore: [404],
    })
  }
}

export default ElasticsearchIndex
