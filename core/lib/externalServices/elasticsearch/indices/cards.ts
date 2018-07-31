import ElasticsearchIndex from './ElasticsearchIndex'

class CardsIndex extends ElasticsearchIndex {
  constructor(props?: any) {
    super({name: 'cards', ...props})
  }

  get mappings() {
    return {
      id: {type: 'keyword'},
      name: {type: 'keyword'},
      set: {type: 'keyword'}, // Further improve on mappings for better searchability
    }
  }

  public async createCard(id: string, props: any) {
    return this.createDocument(id, props)
  }

  public async updateCard(id: string, props: any) {
    return this.updateDocument(id, {doc: props})
  }
}

export default new CardsIndex()
