export function serialize(props: object) {
  if (!props) return null
  const sortedProps = Object.keys(props)
    .sort()
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: props[key],
      }),
      {}
    )
  return Buffer.from(JSON.stringify(sortedProps)).toString('base64')
}

export function deserialize(str: string) {
  if (!str) return null
  return JSON.parse(Buffer.from(str, 'base64').toString())
}

export default {serialize, deserialize}
