import fetch from 'node-fetch'

async function scryfall(url: string) {
  let data = []
  const response = await fetch(url)
  const result = await response.json()

  data = data.concat(result.data)
  
  if (result.has_more && result.next_page) {
    const moreData = await scryfall(result.next_page)
    data = data.concat(moreData)
  }

  return data
}

export default scryfall
