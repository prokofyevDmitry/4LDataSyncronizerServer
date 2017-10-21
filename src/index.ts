//var http = require('http');import * as http from 'http'
//import EventEmitter from 'events';
import express = require('express');
import config from './config';

import schedule from 'node-schedule';
import winston from 'winston';
import session = require('express-session');

const app = express();


const sess = {
    secret: 'keyboard cat',
    cookie: {
        maxAge: 600000
    }
};
app.use(session(sess));


app.get('/', (req, res) => {
    console.log('In home');
    res.render('todo.ejs', {todos: req.session.todos});
    const port = app.get('portCom');
    port.write("Hello stanger");


});


// app.get('/:todo', (req, res) => {
//     // adding a todo to the session
//     const todo = req.params.todo;
//     if (req.session.todos) {
//         console.log(req.session.todos);
//         console.log(typeof req.session.todos)
//         // si le todo existe alors on le suprime
//         const index = req.session.todos.indexOf(todo);
//         if (index > -1)
//             req.session.todos.splice(index, 1);
//         else
//             req.session.todos.push(todo);
//     }
//     else {
//         console.log('Adding a new todo');
//         console.log(todo);
//         req.session.todos = [todo];
//         console.log(req.session.todos);
//     }
//     res.redirect('/');
// });


// app.get('/chambre/:number', (req, res) => {
//     res.render('todo.ejs', {number: req.params.number})
//
// });

app.listen(8080, () => {
    // initialisation com PRG4


    //INIT SERIAL COM







//     // TODO: remove when axel connected
//     // launching cron job to give emulate data from axcelerometer
//     var rule = new schedule.RecurrenceRule();
//
//     rule.second = new schedule.Range(0, 59, 5);
//     const axcelEmul = schedule.scheduleJob(rule, () => {
//         const portEmulator = new SerialPort(config.portComEmulator.name, config.portComEmulator.configs);
//         portEmulator.open((err) => {
//             if (err) return console.log('Error opening port: ', err.message);
//             // generation des messages aléatoires
//             const lat =  ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 )* 90 * Math.random();
//             const lng =  ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 )* 180 * Math.random();
//
//             const alt = ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 )* 2000 * Math.random();
//
//             const magx = 360 * Math.random();
//
//             const roll = ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 )* 180 * Math.random();
//
//             const pitch = ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 )* 180 * Math.random();
//
//
// //            pc.printf("%.8lf:%.8lf:%.1lf:%.1lf:%.1lf:%.1lf\n",  lat,lng,alt,magx,roll,pitch);
//
//             portEmulator.write(`${lat.toFixed(8)}:${lng.toFixed(8)}:${alt.toFixed(1)}:${magx.toFixed(1)}:${roll.toFixed(1)}:${pitch.toFixed(1)}\n`);
//             portEmulator.close();
//         });
//         console.log('Executed cron')
//     });
});



// const server = http.createServer((req, res) =>  {

//   res.writeHead(200);
//   Hello();
//   res.end('Salut tout le monde :) !');

//   emitter.emit('request',[req.headers])
//   ByeBye();

// });

// server.on('close',()=> console.log('Closign server'));



// server.listen(8080);


export default app;



