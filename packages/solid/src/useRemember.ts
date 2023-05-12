import { router } from '@inertiajs/core'
import { createSignal, Setter, Signal } from 'solid-js'

export function useRemember<State>(initialState: State, key?: string): Signal<State> {
  const restored = router.restore(key) as State
  const [get, set] = createSignal(restored !== undefined ? restored : initialState)
  const setter = (next) => {
    const value = set(next)
    router.remember(value, key)
    return value
  }
  return [get, setter as Setter<State>]
}
