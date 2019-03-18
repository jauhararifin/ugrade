import { DependencyList, EffectCallback, useEffect } from 'react'

const singleEffectMemo: { [id: string]: boolean } = {}

/**
 * useSingleEffect is react hook that do something like useEffect. The
 * difference is, when you use useSingleEffect, only one of this effect in the
 * entire app is running. The same effect is identified by same `effectId`.
 * Suppose there are two component that use this hook. Two of them using
 * `effectId` "foobar". The first component will execute the effect just like
 * useEffect hook. The second component however will not execute the effect if
 * first component haven't cleaned up yet.
 *
 * @param effectId - Identifier to tell whether the effect is equal
 * @param effect - Imperative function that can return a cleanup function
 * @param deps - If present, effect will only activate if the values in the
 * list change.
 */
export function useSingleEffect(
  effectId: string,
  effect: EffectCallback,
  deps?: DependencyList
) {
  useEffect(() => {
    if (!singleEffectMemo[effectId]) {
      singleEffectMemo[effectId] = true
      const cleanUp = effect()
      return () => {
        singleEffectMemo[effectId] = false
        if (typeof cleanUp === 'function') cleanUp()
      }
    }
  }, deps)
}
