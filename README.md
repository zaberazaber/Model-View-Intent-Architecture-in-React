# Model-View-Intent-Architecture-in-React
 
Redux is a popular and quality state container. Most importantly, it provides a good basis for implementing the MVI architecture. Redux usage can be very simple. Our `customState` container used a function that converted the current state and an intent to a new updated state. In Redux, this function is called a `reducer` because it `reduces the stream of intents to a single object`, the application state at a moment in time.

We have referred to the `events` that trigger state changes as `intents`, because that's what they're called in the context of the model-view-intent architecture. `Redux` refers to the same thing as `actions`. 
```
An intent and an action are the same thing.
```

The Redux API will be familiar. I used the same API for our custom state container. `CreateStore(reduce , initialState)` is the function used to create a new store, which is the container for our application state. To create a store, the programmer supplies a `reducer` function and the initial store state. 

`getState()` returns the current application state from within the store. 
`dispatch()` sends an action to the store to be applied to the current state. The action is processed by the reducer function which builds a new application state. 
`subscribe()` registers a call back to be called when the application state held within the store changes.

In our custom state repository we have a view update function. It's using our custom createStore to create our custom state container, which is assigned to the identifier container. now what to convert the application to use Redux, instead of our custom store, is I'll delete the createStore function, because we won't be needing that anymore. And where it was called, let's change that to Redux's createStore.
```
let container = Redux.createStore(update);
```
```
actions must be plain objects. This is a Redux convention that says that actions should be objects
```
Further part of that convention is that the `objects should have a property called type`. Now this is `optional`, but it is the way that Redux is typically used.
So everywhere that I'm publishing an action, instead of using a string, I need to change that into an object with a type property.
```
  container.dispatch(m.running ? {type: 'STOP'} : {type: 'START'} );
```
That takes care of the button click.

We also publish or dispatch an action on a timer,
```
    container.dispatch({type: 'TICK'});
```

In the update function, I will rename intent to action because that's the terminology that Redux uses. And now instead of switching on the intent, I'll switch on the type property of the action. And that's all I have to do to convert the application to using Redux.
```
let container = Redux.createStore((model = { running: false, time: 0 }, action) => {  
    const updates = {
        'START': (model) => Object.assign(model, { running: true }),
        'STOP': (model) => Object.assign(model, { running: false }),
        'TICK': (model) => Object.assign(model, { time: model.time + (model.running ? 1 : 0) })
    };
    return (updates[action.type] || (() => model))(model);
});
```

Because our customs state container used the same API with `dispatch()`, `getState()`, and `subscribe()`. The only changes that were required were to use Redux's createStore function and to `convert` our `actions` to be `objects`, instead of `strings`.




# Cloning and Running the Application in local
`Clone` the project into local

`Install` all the `npm packages`. Go into the project folder and type the following command to `install` all `npm packages`

```
npm install                                                                    
```

In order to run the application Type the following command

```
npm start  
```

The Application Runs on localhost:3000

:+1: happy coding :computer:



