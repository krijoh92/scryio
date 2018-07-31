import {Projection} from '@ddes/core'
import {AsyncCargo, cargo} from 'async'
import config from 'config'
import {SearchParams} from 'elasticsearch'
import {client as es} from 'lib/externalServices/elasticsearch'
import logger from 'lib/logger'
import {meta} from 'lib/stores'
import {flatten, pick} from 'lodash'
import Logger from 'winston'

const RETRIES = 3

class ElasticsearchProjection extends Projection {
  protected mappings: {}
  protected logger: Logger.Logger
  protected cargo?: AsyncCargo
  protected bulk: boolean
  protected processed: number

  constructor(props) {
    super({metaStore: meta, ...props})
    this.maxBatchSize = 5000
    this.bulk = false
    this.processed = 0
    this.logger = logger
    if (this.bulk) {
      this.cargo = cargo(async docs => {
        const body = flatten(docs)
        // log progress
        // this.processed += docs.length
        // this.processed += docs.filter(doc => doc.action).length
        // console.log(`Processed: ${this.processed}`)
        try {
          await this.client.bulk({body})
        } catch (error) {
          this.logger.error(error)
        }
      })
    }
  }

  get index() {
    return this.name
  }

  get client() {
    return es
  }

  public async setup() {
    console.log('Setting up elasticsearch projection')
    await super.setup({
      startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
    })
    await this.createIndex()
  }

  public async createIndex() {
    const {index, client} = this
    this.logger.info(`Creating Elasticsearch index: ${index}`)
    const mappings = {doc: {properties: this.mappings}}
    const result = await client.indices.create({
      index,
      body: {mappings},
      ignore: [400],
    })
    if (result.error && result.error.type !== 'resource_already_exists_exception') {
      throw result.error
    }
  }

  public async teardown() {
    const {index, client} = this
    this.logger.info(`Destroying Elasticsearch index: ${index}`)
    await client.indices.delete({index, ignore: [400, 404]})
    return await super.teardown()
  }

  public async search(params: SearchParams) {
    return this.client.search({index: this.index, ...params})
  }

  public async fetchAll(body?: any, fields?: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const result = []
      const scroll = '30s'

      const params = {
        body,
        scroll,
        index: this.index,
        size: 2000,
        _source: !!fields,
      }

      es.search(params, function getMore(error, response) {
        if (error) return reject(error)
        for (const hit of response.hits.hits) {
          if (fields) {
            result.push({_id: hit._id, ...pick(hit._source, fields)})
          } else {
            result.push(hit._id)
          }
        }

        if (response.hits.total > result.length) {
          const scrollId = response._scroll_id
          es.scroll({scrollId, scroll}, getMore)
        } else {
          return resolve(result)
        }
      })
    })
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
      await client.reindex({
        body: {source: {index: tempIndex}, dest: {index}},
      })
    } catch (err) {
      this.logger.error(err)
    } finally {
      await client.indices.delete({index: tempIndex, ignore: [404]})
    }
  }

  public async createDocument(id: string, body: any, index = this.index) {
    if (this.bulk) {
      return this.cargo.push([
        [
          {
            index: {
              _index: index,
              _type: 'doc',
              _id: id,
              retry_on_conflict: RETRIES,
            },
          },
          body,
        ],
      ])
    }

    const {client} = this
    return await client.index({
      index,
      id,
      body,
      type: 'doc',
    })
  }

  public async updateDocument(id: string, body: any, index = this.index) {
    if (this.bulk) {
      return this.cargo.push([
        [
          {
            update: {
              _index: index,
              _type: 'doc',
              _id: id,
              retry_on_conflict: RETRIES,
            },
          },
          body,
        ],
      ])
    }

    const {client} = this
    return await client.update({
      index,
      id,
      body,
      type: 'doc',
      ignore: [404],
      retryOnConflict: RETRIES,
    })
  }

  public async deleteDocument(id: string, index = this.index) {
    if (this.bulk) {
      return this.cargo.push([
        {
          delete: {
            _index: index,
            _type: 'doc',
            _id: id,
            ignore: [404],
            retry_on_conflict: RETRIES,
          },
        },
      ])
    }

    const {client} = this
    return await client.delete({
      index,
      id,
      type: 'doc',
      ignore: [404],
    })
  }
}

export default ElasticsearchProjection
