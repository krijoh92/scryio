#!/usr/bin/env node
import {scryfall, wait} from 'lib'
import {Set} from 'lib/aggregates'
import {cards as cardIndex} from 'lib/externalServices/elasticsearch/indices'
import fetch from 'node-fetch'

async function mtgCards() {
  for await (const set of Set.scanInstances()) {
    const url = `https://api.scryfall.com/cards/search?order=set&q=${encodeURIComponent(`e:${
      set.state.code
    }`)}&unique=prints`
    console.log(`Fetching cards for ${set.state.name}`)

    const cards = await scryfall(url)
    console.log(`Found ${cards.length} in ${set.state.name}`)
    for await (const card of cards) {
      try {
        await cardIndex.createCard(card.id, card)
      } catch (e) {
        console.log(`Couldn't create card:`)
        console.dir(card, {depth: null})
        console.log(e)
      }
    }
    await wait({seconds: 0.5}) // Being nice to scryfall and to our elasticsearch
  }
}

export default mtgCards

if (!module.parent) {
  mtgCards().catch(error => {
    console.log(error)
    process.exit(1)
  })
}
