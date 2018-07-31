import {elasticsearch} from '../services'

export default async function setup() {
  return Promise.all([elasticsearch.setup()])
}
