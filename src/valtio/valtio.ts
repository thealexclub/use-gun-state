import { useCallback, useMemo } from "react";
import { useSnapshot } from "valtio";
import { INTERNAL_Snapshot, proxy } from "valtio/vanilla";

/**
 * Type of useStore updater function
 */
export type Updater<T> = (updater: (store: T) => void) => void;

/**
 * Pretty warpper for INTERNAL_Snapshot<T>
 */
export type State<T> = INTERNAL_Snapshot<T>;

/**
 * Wrapper for [valtio](https://github.com/pmndrs/valtio)
 * to make simple state management easier
 *
 * @param initalStore {T extends object} - The object with which to initialise the store
 *
 * #Usage
 *
 * Mimics the `React.useState` with one key difference
 *
 * Instead of `setState` we get `updateState` which allows for
 * finer control over nested pieces of state
 *
 * Due to valtios inner proxy magic we can just update the store like
 * we would any normal JavaScript object! Such fun.
 *
 * @example
 * ```
 * interface IStore {
 *    title: string;
 * }
 *
 * const [state, updateState] = useStore<IStore>({
 *    title: 'A Title'
 * });
 *
 * const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *  updateState((store: State<IStore>) => {
 *    store.title = e.target.value;
 *  });
 * }
 *
 * return (
 *  <input type="text" value={state.title} onChange={onChange} />
 * )
 *```
 */
export default function useStore<T extends object>(
  initalStore: T
): [State<T>, Updater<T>] {
  const store = useMemo(function proxyTown() {
    const _store = proxy<T>(initalStore);
    return _store;
  }, []);

  const snapshot = useSnapshot<T>(store);

  const updateStore = useCallback(function updaterVille(
    updater: (store: T) => void
  ) {
    updater(store);
  },
  []);

  return [snapshot, updateStore];
}
