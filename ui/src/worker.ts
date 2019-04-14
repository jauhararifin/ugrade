import { exec } from 'child_process'
import { getToken } from './auth'

export async function runWorker() {
  const token = getToken()
  if (token && token.length > 0) {
    const process = new Promise((resolve, reject) =>
      exec(`ugrader consume -t "${token}"`, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    )
    const maxTime = new Promise(resv => setTimeout(resv, 60 * 1000 * 5)) // maximum 5 minute
    await Promise.all([process, maxTime])
    return true
  }
  return false
}

export async function startWorker() {
  while (true) {
    const doWork = await runWorker()
    if (!doWork) {
      await new Promise(resv => setTimeout(resv, 5000))
    }
  }
}
