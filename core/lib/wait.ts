export default async function wait({
  attempt,
  initialDelay = 1,
  backoffRate = 2,
  seconds,
}: {
  attempt?: number
  initialDelay?: number
  backoffRate?: number
  seconds?: number
}): Promise<void> {
  const delay = seconds ? seconds * 1000 : initialDelay * backoffRate ** attempt
  await new Promise(resolve => setTimeout(resolve, delay))
}
