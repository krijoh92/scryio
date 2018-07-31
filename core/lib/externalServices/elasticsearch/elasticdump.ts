import Elasticdump from 'elasticdump'

function elasticdump(input, output, type?: 'settings' | 'analyzer' | 'data' | 'mapping' | 'alias') {
  const esdump = new Elasticdump(input, output, {
    input,
    output,
    limit: 100,
    offset: 0,
    debug: false,
    type,
    delete: false,
    maxSockets: null,
    'input-index': null,
    'output-index': null,
    inputTransport: null,
    outputTransport: null,
    searchBody: null,
    headers: null,
    sourceOnly: false,
    jsonLines: false,
    format: '',
    'ignore-errors': false,
    scrollTime: '10m',
    timeout: null,
    toLog: true,
    quiet: false,
    awsChain: false,
    awsAccessKeyId: null,
    awsSecretAccessKey: null,
    awsIniFileProfile: null,
    awsIniFileName: null,
    transform: null,
    httpAuthFile: null,
  })

  return new Promise((resolve, reject) => {
    esdump.on('error', reject)
    esdump.dump(err => (err ? reject(err) : resolve()))
  })
}

export default elasticdump
