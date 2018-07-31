#!/usr/bin/env node
import { scryfall } from 'lib'
import {Set} from 'lib/aggregates'
import fetch from 'node-fetch'

async function mtgSets() {
  const sets = await scryfall('https://api.scryfall.com/sets')

  await Promise.all(
    sets.map(
      async ({
        name,
        code,
        set_type: type,
        released_at: releaseDate,
        block,
        block_code: blockCode,
        parent_set_code: parentCode,
        searc_uri: searchUrl,
        icon_svg_uri: iconSvg,
        card_count: cardCount
      }) => Set.create({
        name,
        code,
        type,
        releaseDate,
        block,
        blockCode,
        parentCode,
        iconSvg,
        cardCount
      })
    )
  )
}

export default mtgSets

if (!module.parent) {
  mtgSets().catch(error => {
    console.log(error)
    process.exit(1)
  })
}
