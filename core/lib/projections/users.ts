import {EventWithMetadata} from '@ddes/core'
import builder from 'bodybuilder'
import {User} from 'lib/aggregates'
import ElasticsearchProjection from './ElasticsearchProjection'

class UsersProjection extends ElasticsearchProjection {
  constructor(props?: any) {
    super({name: 'users', aggregateClasses: {User}, ...props})
  }

  get mappings() {
    return {
      email: {type: 'keyword'},
      username: {type: 'keyword'},
      password: {type: 'keyword'},
    }
  }

  public processEvents = async events => {
    for (const event of events) {
      const {type, aggregateKey: id, properties} = event
      console.log(`${type} event happened!`)
      switch (type) {
        case 'Created': {
          await this.createUser(id, properties)
          break
        }

        case 'Updated': {
          await this.updateUser(id, properties)
          break
        }
      }
    }
  }

  private async createUser(id: string, props: any) {
    return this.createDocument(id, this.userProps(props))
  }

  private async updateUser(id: string, props: any) {
    return this.updateDocument(id, {doc: this.userProps(props)})
  }

  private userProps(props: any) {
    return {
      username: props.username,
      email: props.email,
      password: props.password,
    }
  }
}

export default new UsersProjection()
