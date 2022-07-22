import { GunSchema } from "gun";
import { useMemo } from "react";
import useStore, { State } from "../valtio/valtio";
import { useGunContext } from "./gun-context";

/**
 * ## SetState
 *
 * A Pretty type for the setState action
 */
export type SetState<T> = (state: Partial<T>) => void;

/**
 * ## Use Gun State
 *
 * @param nodeId {keyof T & string} - The id of the gun node you wish to access
 * @returns [State<T>, SetState<T>] - A touple of state and setState just like `React.useState`
 *
 * Mimics the `React.useState` api with a few slight differences.
 *
 * # Difference 1 -> NodeId Not Initial State
 *
 * In a `React.useState` we have to pass in a value to initialise the state with.
 * But in `useGunState` we only pass in the nodeId? Why can't we initialise it with something?
 * Well, gun is a decentralised graph database, so we want the initial data to be what ever is
 * already in the graph. If we passsed in an initial state there is a chance we could override
 * real data that's already waiting there for us :D
 *
 * # Difference 2 -> Nested Set State
 *
 * The `setState` returned from `useGunState` is a little different than the deafualt react one
 * because we are using valtio under the hood we get to make use of it's proxy magic!
 * That means you can pass through a object that is Partial<T> of your state type
 * and only those values will be updated in the valtio store.
 * (If you'd like more info about valtio check it out here https://github.com/pmndrs/valtio)
 *
 * # Difference 3 -> Live Updates
 *
 * Because we are using gun we get real time updates for free!
 * In the below example we have two people are looking at the same todo item, let's call them Alex and Blitz.
 * When Blitz changes the title of the todo by typing into the input, Alex's title will
 * update live as the changes are made. Wow, technology is crazy isn't it...
 *
 * @example
 * ```
 * const [todo, setTodo] = useGunState({
 *   title: 'A Title',
 *   completed: false,
 *   assigned: 'Alex',
 *   collaborator: 'Blitz',
 * });
 *
 * const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *  setState({
 *    title: e.target.value;
 *  });
 * }
 *
 * return (
 *   <div className="Todo">
 *     <input type="text" value={todo.title} onChange={onChange} />
 *     <input type="checkbox" value={todo.completed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ completed: e.target.checked })}
 *   </div>
 * )
 * ```
 *
 *
 */
export default function useGunState<T extends Record<string, GunSchema>>(
  nodeId: keyof T & string
): [State<T>, SetState<T>] {
  const gun = useGunContext();

  const [state, _updateState] = useStore<T>({} as T);

  const gunOn = (data: Partial<T>) => {
    _updateState((d) => {
      for (const [key, value] of Object.entries(data)) {
        d[key as keyof T] = value as T[keyof T];
      }
    });
  };

  const node = useMemo(
    function getGunNode() {
      const _node = gun.get<T[typeof nodeId], typeof nodeId, T>(nodeId);
      _node.on(gunOn);
      return _node;
    },
    [nodeId]
  );

  const updateState = (data: Partial<T>) => {
    node.put(data as any);
  };

  return [state, updateState];
}
