# Use Gun State

A react hook wrapper for [GUN](https://github.com/amark/gun) with an api that mimics `React.useState`

## Installation

```
yarn add use-gun-state
```

or

```
npm install --save use-gun-state
```

## Usage

### Initialising Gun

`useGunState` requires a `GunContext` at the root level of the react tree.

Gun doesn't seem to like being instantiated inside the react tree. So we have to instantiate a new `IGunInstanceRoot` at outside of the react tree and then pass it down to the `GunContext` so the `useGunState` hooks further down the tree can have access to it.

```ts
App.tsx;

const gun = Gun({
  peers: ["https://uri/to/peer:6789"],
  radisk: true,
  localStorage: true,
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <GunContext gun={gun}>
      <App />
    </GunContext>
  </React.StrictMode>
);
```

### Setting State

The pattern of usage inside components is much the same as `React.useState` so it should feel reasonably familiar to any seasoned React developer.

There are three main differences in the way `useGunState` is works.

_Difference 1 -> NodeId Not Initial State_

In a `React.useState` we have to pass in a value to initialise the state with.
But in `useGunState` we only pass in the nodeId? Why can't we initialise it with something?
Well, gun is a decentralised graph database, so we want the initial data to be what ever is
already in the graph. If we passsed in an initial state there is a chance we could override
real data that's already waiting there for us :D

_Difference 2 -> Nested Set State_

The `setState` returned from `useGunState` is a little different than the deafualt react one
because we are using valtio under the hood we get to make use of it's proxy magic!
That means you can pass through a object that is Partial<T> of your state type
and only those values will be updated in the valtio store.
(If you'd like more info about valtio check it out here https://github.com/pmndrs/valtio)

_Difference 3 -> Live Updates_

Because we are using gun we get real time updates for free!
In the below example we have two people are looking at the same todo item, let's call them Alex and Blitz.
When Blitz changes the title of the todo by typing into the input, Alex's title will
update live as the changes are made. Wow, technology is crazy isn't it...

```ts
const [todo, setTodo] = useGunState({
  title: 'A Title',
  completed: false,
  assigned: 'Alex',
  collaborator: 'Blitz',
});

const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 setState({
   title: e.target.value;
 });
}

const onCompletedChange = (e: React.ChangeEvent<HTMLInputElement>) => setState({ completed: e.target.checked })

return (
  <div className="Todo">
    <input type="text" value={todo.title} onChange={onTitleChange} />
    <input type="checkbox" value={todo.completed} onChange={onCompletedChange}
  </div>
)
```
