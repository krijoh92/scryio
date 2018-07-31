import {readFileSync} from 'fs'

const schemaFiles = ['queries', 'mutations', 'subscription']

const schema = schemaFiles.reduce(
  (res, file) => [res, readFileSync(`${__dirname}/${file}.graphql`).toString()].join(''),
  ''
)

export default schema
