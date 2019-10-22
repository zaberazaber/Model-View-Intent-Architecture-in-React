# Model-View-Intent-Architecture-in-React
## The basics of model view intent architecture in React

An application built with the model-view-intent architecture is described by three components.

```
The model, 
the view, 
and intents. 
```

The model is a single object that completely describes the state of the user interface. 

The view is a function that transforms the model into the user interface. 
That is the model is the input to the view function and 
the user interface is the output of the view function. At any moment, the user interface can be generated based on nothing but the model. 

`When the model changes`, the view function can generate the corresponding changed user interface, 
which leads us to the question, `"How is the model changed? "` 
the user interface generated by the view function can produce `intents`. Intents are things the user wants to do.
When an intent is produced it is applied to the model creating an updated model. The updated model is then passed through the view function to produce the updated user interface. This process forms a neat predictable cycle that is easy to reason about for a few key reasons. 
`One`, the model is the total source of truth. The entire user interface is described by the model. 
`Two`, the view produces the user interface based on nothing but the model. And 
`three`, the model can only be changed by processing intents on the current model.
```
Model-view-intent can be thought of as a finite state machine in which the model is the set of
possible states, and the intents are the possible transitions. Intents transition the model from 
one state to the next. The view is a function from the model to a user interface.
```
If we were to build up a model-view-intent architecture from scratch, we might start with the following pseudo code.
```
let model ={};

The model is a plain JavaScript object. It will contain properties according to the complexity
of the view. The more the view can change, the more those possibilities must be represented in the model.
```

```
let view = (m) => <.../>;

The view is then a function that takes the model we have made and produces a user interface. 
In React, this user interface can be represented with JSX.
```

```
let update = (m,intent) => m2

The third component, `update`, is the function that controls how intents form the user interface
are applied to the model to produce an updated model.
```


To demonstrate the MVI architecture, we will build a stopwatch application. It will display how long the timer has been running in minutes and seconds. It will have a button to start the timer and a button to stop the timer. 

```
const model = {
  running: false,
  time: 0
  };
  
 const view =(model) => <div>{model.time}</div>;
 
 ReactDOM.render(view(model),
  document.getElementById('root')
  );
 ```
  
the above code begins with a model object that is intended to encapsulate the entire state of our application. We're building a stopwatch. So to begin with our `model` has two properties. `Running` is a Boolean value that indicates if the stopwatch is running and `time` is the current value of the stopwatch. Next we have our `view function`, which as we've discussed, is a function that can take the model at any moment in time and convert it into a user interface. In this example, I'm using React and JSX to specify the UI. And at the moment, all it does is render a div containing the time value of the timer. And finally, we used `ReactDOM.render` to render the result of passing the model to the view function, because the time in our model object is zero, that's what we see in our user interface. 

```
let model = {
  running: false,
  time: 0
  };
  
 const view =(model) => {
 let minutes = Math.floor(model.time /60);
 let seconds = model.time - (minutes*60);
 let secondsFormatted = `${seconds <10 ? '0' : ''}${seconds}`
 return <div>{minutes}:{secondsFormatted}</div>;
 
 let intents = {
 TICK: 'TICK',
 START: 'START',
 STOP: 'STOP',
 RESET: 'RESET'
 };
 
 ReactDOM.render(view(model),
  document.getElementById('root')
  );
 ```

The model view intent architecture uses user intents to update the model. And updating the model in turn updates the user interface. So, what are the possible user intents for a stopwatch application? I would define them here in an object. The user may choose to `start` the timer. The user may choose to `stop` the timer. The user may choose to `reset` the timer. There's a tick intent, and this one is not produced by the user, but it's rather produced by the environment. Because a stopwatch is measuring time, we use a timer to generate ticks once every second. This version has a more sophisticated view function. And now what it's trying to do is output the value of the timer in minutes and seconds. So the function firstly has to calculate how many minutes are represented by the time value, which is a value in seconds, and how many seconds remain once you've taken out the minute components, and then the output that's rendered is just updated to include the minutes and seconds values separated by a colon. Because the model now has a time value of 110, when the UI is rendered, it comes out as one minute and 50 seconds. 

```
let secondsFormatted = `${seconds <10 ? '0' : ''}${seconds}`
```
a secondsFormatted options, and this is what's known as a left pad. The secondsFormatted value adds a leading zero to the seconds value if it's less than 10. So that the output is written as 8:01, not just 8:1. 

```
const render = () => {
ReactDOM.render(view(model),
  document.getElementById('root')
  );
  };
 render();
 setInterval(() => {
  model = update(model, 'TICK');
  render();
 }, 1000);
 
 ```
The other big change in this version is firstly that we now have a timer firing once every thousand milliseconds, once every second, and this is calling a function called `update`, passing in the current application `state`, as well as an `intent`. shown below:
```
 model = update(model, 'TICK');
 ```
 
 If we look at that `update` function used in the above line, the job of the `update` function is to imply the intent to the model and produce a new model, and how it does that is by having a `map of a intents to functions` that make some kind of an update to the current model. In this case, if the intent is a `tick`, then we want to take the current model and increment the time value by `one`, The final line of the function is simply selecting the correct update function based on the intent and then applying that function to the current model `return updates[intent](model);`.
 
 ```
 const update = (model,intent) => {
    const updates = {
        'START': (model) => Object.assign(model, { running: true }),
        'STOP': (model) => Object.assign(model, { running: false }),
        'TICK': (model) => Object.assign(model, { time: model.time + (model.running ? 1 : 0 )})
    };
    return updates[intent](model);
}
```
 
 
 Back in our timer, the new model is then reassigned to the model identifier `model = update(model, 'TICK');` and a render function ` render();` is called, and a render function just wraps the standard ReactDOM. render where we render the output of the view function based on the current model `ReactDOM.render(view(model),` .  
 
 
So, now we have a complete working MVI architecture showing the completely life cycle. We start with a default model. We publish intent. An update function applies that intent to make some kind of modification to the model, which then causes the application to be re-rendered through the view function based upon the updated model.


Now we want to add some user interact to the example. The view function has changed to include a button, as well as the output of the timer value. It's a single button that's meant to be used as a start button if the timer is not running, and convert to a stop button if the timer is running when the application first starts the timer will read zero. And if a user clicks the start button, we want the timer to begin timing, and we want the start button to convert to a stop button. The way that we do that in React is by using the onClick handler of the button,

```
   <button onClick={handler} > {model.running ? 'Stop' : 'Start'}</button>
```

which is bound to this handler function. The handler function calls the update function, passing in the current model and an intent.

```
 let handler = (event) => {
        model = update(model, model.running ? 'STOP' : 'START');
    };
```

The intent that's passed to the update function depends on whether or not the timer is currently running. If the timer is running, then the intent is a stop intent. If the timer is not running, then the intent is a start intent. Now our update function needs to be able to handle those two extra intents. So the tick intent has changed slightly. Now instead of updating the model once every second regardless, we firstly check whether the timer is running. If the timer is running, then every second will add one to the time. If the timer is not running, then every second will add zero to the time.
The `start` intent modifies the application state by setting the running property to `true` and the `stop` intent setts the running property to `false`.

```
const update = (model,intent) => {
    console.log(model,intent)
    const updates = {
        'START': (model) => Object.assign(model, { running: true }),
        'STOP': (model) => Object.assign(model, { running: false }),
        'TICK': (model) => Object.assign(model, { time: model.time + (model.running ? 1 : 0 )})
    };
    return updates[intent](model);
}
```

Everything else remains unchanged. So now if I click the start button, that publishes the start intent, the update function processes that start intent, changes the running value to true, and then on every tick, the timer is incremented. If I click the stop button, then the stop intent is published, the application is updated setting running to false, and the timer stops being incremented every second. 




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



