# State Container In React
```
A `state container` is a component that takes care of holding the model and controlling updates through the model.
```

The custom state container will implement three methods. 
`GetState()` 
returns the current application state object held by the state container.

`Dispatch()` 
applies an intent to the application state, producing a new application state.

`Subscribe()` 
registers a call back to be called when the application state changes. That is when an intent is passed to the dispatch method.

The code I have here so far is from the master branch. So we have an update function, and it's responsible for being able to apply intents to the application state to produce new application states.
the initial value of the application state is now specified as a `default` for the model parameter.
```
const update = (model = {running: false, time: 0},intent) => {.....}
```
I've defined a value called `container`, which is currently an empty object, and this is where we will implement our state container.
```
let container ={};
```

In the render function, the view needs to convert our application state to a user interface. So we need to be able to get access to our application state, and I'd like to do that by calling container. `getState`. So that should return the current application state when it's called.
```
const render =( ) => {
// ReactDOM.render(model),
ReactDOM.render(View(container.getState()),
    document.getElementById('root')
);
};
```

we need to be able to `dispatch` intents to our container by providing intent in out interval that is 'TICK' 
```
setInterval( () => {
    // model = update(model, 'TICK');
    container.dispatch('TICK');
    // render();
   }, 1000);
 ```
 
 similarly, in our `view` when someone `clicks` on the `stop start` button, 
 ```
  let handler = (event) => {
        // model = update(model, model.running ? 'STOP' : 'START'); 
        container.dispatch(mmodel.running ? 'STOP' : 'START')
    };
 ```
 
make sure that the user interface is rendered when the model changes. And to do that, subscribe a callback function to be called when the model changes. And in this case, that function is render.
```
// render();
container.subscribe( render() );
```

So far we've worked from the outside in and we've come up with the API we want to use to work with our state container. What we haven't done is actually implemented the container. It's just an empty object. We need a way of building our state container, so I'll call a function called `createStore`.
```
let container = createStore(update);
```

because it needs to apply intents to our model, the `createStore()` function is going to need the update function which is the `reducer`. 
CreateStore needs to return our application state container, which is an object. And as previously described, it needs to have a `dispatch` function that expects an `intent`. It needs to have a `subscribe` function that expects a `callback`, and it needs to have a `getState` function that returns the `current state`.
```
const createStore = (reducer) => {
    return {
        dispatch: ( intent ) => { },
        subscribe: (handler) =>{ },
        getState: ( ) => {}
    };
}
```

When dispatch is called and an intent is passed. We need to call our update function which we've called reducer. We need to pass in the `currentState` and we need to pass in the `intent` so we don't have that current state yet. So I'll call that  `internalState` and define a variable with that identifier, `internalState`. Because the reducer returns the new state, then we need to assign that to internal state. `  internalState = reducer( internalState, intent)`

So when somebody dispatches an intent, we set the internal state to be the new state produced by our update function.
```
      dispatch: ( intent ) => {
           internalState = reducer( internalState, intent)
         },
```

That also makes it trivial to implement our get state. That function can just return the internal state value.
```
    getState: ( ) => internalState
    };
```

Subscribe is used to register callbacks that get invoked when the application state changes. So, when that function is called, we can simply push the handler onto an array of handlers.
```
  subscribe: (handler) =>{
            handlers.push(handler)
         },
 ```

And once again, we need to define an identifier for that, and that can be initialized to the empty array.
```
let handlers = [];
```

Now that we have that collection of handlers, when an intent is dispatched, after we've updated the internal state, we then need to invoke each of those handlers. So that's simply a matter of looping through the collection of handlers and invoking each one.
```
  handlers.forEach( h => { h () ; } )
```


