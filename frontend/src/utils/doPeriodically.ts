/**
 * doPeriodically runs a async function F periodically. This can be used to
 * listen to  state change, by asking the server periodically. When there is an
 * error, this will call onError function. When the F function succesfully
 * executed, this will call onItem function. This will return a function to
 * cancel the execution. Example usage
 *
 * ```
 * // when component mounted
 * const cancel = doPeriodically(somefunc)
 *
 * // when component unmount
 * cancel()
 * ```
 *
 * @param func - Function to run periodically
 * @param onError - Function that called everytime `func` throw an error
 * @param onItem - Function that called everytime `func` return value
 * @param delay - The duration every `func` called
 * @return Cancel function that is used to cancel stop all of this.
 */
export function doPeriodically<T>(
  func: () => Promise<T>,
  onError?: (error: Error) => any,
  onItem?: (item: T) => any,
  delay: number = 500000
) {
  let cancelled = false
  const prom = async () => {
    while (!cancelled) {
      try {
        const itemVal = await func()
        if (onItem) onItem(itemVal)
      } catch (error) {
        if (onError) onError(error)
      }
      await new Promise(r => setTimeout(r, delay))
    }
  }
  prom().catch(_ => null)
  return () => {
    cancelled = true
  }
}
