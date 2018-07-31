import config from 'config'
import elasticsearch, {Client} from 'elasticsearch'

const client = new elasticsearch.Client({
  host: config.get('elasticsearch.url'),
  connectionClass: config.has('elasticsearch.aws')
    ? require('http-aws-es')
    : 'http',
  log: null,
})

export default client
