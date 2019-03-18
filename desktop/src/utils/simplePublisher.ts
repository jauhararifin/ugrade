import lodash from 'lodash'
import { globalErrorCatcher } from 'ugrade/common'

export function simplePublisher<T>(
  func: () => Promise<T>,
  callback: (item: T) => any,
  compareFunc: (item1: T, item2: T) => boolean = lodash.isEqual,
  diffFunc: (newItem: T, oldItem: T) => T = (x, _) => x,
  delay: number = 5500
) {
  let lastItem = undefined as T | undefined
  let unsubscribed = false
  const timeout = setInterval(async () => {
    if (!unsubscribed) {
      try {
        const item = await func()
        if (lastItem === undefined || !compareFunc(item, lastItem)) {
          const difference =
            lastItem === undefined ? item : diffFunc(item, lastItem)
          callback(difference)
          lastItem = item
        }
      } catch (error) {
        globalErrorCatcher(error)
      }
    }
  }, delay)
  func()
    .then(item => {
      lastItem = item
      return item
    })
    .then(callback)
    .catch(globalErrorCatcher)
  return () => {
    unsubscribed = true
    clearInterval(timeout)
  }
}
