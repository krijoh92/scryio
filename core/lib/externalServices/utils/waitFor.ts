import logger from 'lib/logger'
import getServiceStatus from './getServiceStatus'

export default async function(
  servicesToWaitFor,
  {timeout = 30000, spacing = 1000} = {}
) {
  logger.info(
    `Waiting ${timeout /
      1000} seconds for services to become ready: ${servicesToWaitFor.join(
      ', '
    )}`
  )

  const startTime = Date.now()
  let timedOut = false

  let notReadyServices

  const timer = setTimeout(() => {
    timedOut = true
    throw new Error(
      `The following services did not become ready: ${notReadyServices
        .map(s => s.name)
        .join(', ')}`
    )
  }, timeout)

  while (timedOut === false) {
    const statusList = (await getServiceStatus(servicesToWaitFor)) as Array<{
      ready: boolean;
      name: string;
    }>
    notReadyServices = statusList.filter(({ready}) => !ready)

    if (notReadyServices.length === 0) break
    await new Promise(resolve => setTimeout(resolve, spacing))
  }

  clearTimeout(timer)

  logger.info(
    `After ${(Date.now() - startTime) / 1000} seconds ${servicesToWaitFor.join(
      ', '
    )} became ready`
  )
}
