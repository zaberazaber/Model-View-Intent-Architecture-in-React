import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';


let model = {
    running: false,
    time: 0
};

// let intents = {
//     TICK: 'TICK',
//     START: 'START',
//     STOP: 'STOP',
//     RESET: 'RESET'
// };
 
const View = (model) => {
    let minutes = Math.floor(model.time / 60);
    // console.log('minutes', minutes);
    let seconds = model.time - (minutes * 60);
    // console.log('time',model.time)
    let secondsFormatted = `${seconds < 10 ? '0' : ' '}${seconds}`
    let handler = (event) => {
        model = update(model, model.running ? 'STOP' : 'START');
    };
     
    return <div>
        <p>{minutes}:{secondsFormatted}</p>
        <button onClick={handler} > {model.running ? 'Stop' : 'Start'}</button>
    </div>;
}

const update = (model,intent) => {
    console.log(model,intent)
    const updates = {
        'START': (model) => Object.assign(model, { running: true }),
        'STOP': (model) => Object.assign(model, { running: false }),
        'TICK': (model) => Object.assign(model, { time: model.time + (model.running ? 1 : 0 )})
    };
    return updates[intent](model);
}


const render =( ) => {
ReactDOM.render(View(model),
    document.getElementById('root')
);
};
render();

setInterval( () => {
    model = update(model, 'TICK');
    render();
   }, 1000);



serviceWorker.unregister();
