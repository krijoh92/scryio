import {Commit} from '@ddes/core'
import {wait} from 'lib'
import * as allProjections from 'lib/projections'

async function waitForElasticsearchProjection(
  commit: Commit,
  options: {
    waitForRefresh?: boolean
    maxAttempts?: number
    projections?: string[]
  } = {}
) {
  const {
    maxAttempts = 10,
    waitForRefresh = true,
    projections = Object.keys(allProjections),
  } = options

  const projectionsToInclude = Object.keys(allProjections)
    .filter(name => projections.includes(name))
    .map(name => allProjections[name])

  let attempt = 0
  while (attempt < maxAttempts) {
    attempt++

    for (const projection of Object.values(projectionsToInclude)) {
      const result = await projection.commitIsProcessed(commit)
      if (result) return true
    }

    if (waitForRefresh) await wait({seconds: 0.5})
  }

  throw new Error('Did not process commit within timeout')
}

export default waitForElasticsearchProjection
