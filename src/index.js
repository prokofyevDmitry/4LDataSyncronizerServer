"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//var http = require('http');import * as http from 'http'
//import EventEmitter from 'events';
var express_1 = require("express");
var config_1 = require("./config");
var node_schedule_1 = require("node-schedule");
var express_session_1 = require("express-session");
var app = express_1.default();
var sess = {
    secret: 'keyboard cat',
    cookie: {
        maxAge: 600000
    }
};
app.use(express_session_1.default(sess));
app.get('/', function (req, res) {
    console.log('In home');
    res.render('todo.ejs', { todos: req.session.todos });
    var port = app.get('portCom');
    port.write("Hello stanger");
});
app.get('/:todo', function (req, res) {
    // adding a todo to the session
    var todo = req.params.todo;
    if (req.session.todos) {
        console.log(req.session.todos);
        console.log(typeof req.session.todos);
        // si le todo existe alors on le suprime
        var index = req.session.todos.indexOf(todo);
        if (index > -1)
            req.session.todos.splice(index, 1);
        else
            req.session.todos.push(todo);
    }
    else {
        console.log('Adding a new todo');
        console.log(todo);
        req.session.todos = [todo];
        console.log(req.session.todos);
    }
    res.redirect('/');
});
app.get('/chambre/:number', function (req, res) {
    res.render('todo.ejs', { number: req.params.number });
});
app.listen(8080, function () {
    // initialisation com PRG4
    //INIT SERIAL COM
    // TODO: remove when axel connected
    // launching cron job to give emulate data from axcelerometer
    var rule = new node_schedule_1.default.RecurrenceRule();
    rule.second = new node_schedule_1.default.Range(0, 59, 5);
    var axcelEmul = node_schedule_1.default.scheduleJob(rule, function () {
        var portEmulator = new SerialPort(config_1.default.portComEmulator.name, config_1.default.portComEmulator.configs);
        portEmulator.open(function (err) {
            if (err)
                return console.log('Error opening port: ', err.message);
            // generation des messages aléatoires
            var lat = ((Math.round(Math.random()) === 0) ? -1 : 1) * 90 * Math.random();
            var lng = ((Math.round(Math.random()) === 0) ? -1 : 1) * 180 * Math.random();
            var alt = ((Math.round(Math.random()) === 0) ? -1 : 1) * 2000 * Math.random();
            var magx = 360 * Math.random();
            var roll = ((Math.round(Math.random()) === 0) ? -1 : 1) * 180 * Math.random();
            var pitch = ((Math.round(Math.random()) === 0) ? -1 : 1) * 180 * Math.random();
            //            pc.printf("%.8lf:%.8lf:%.1lf:%.1lf:%.1lf:%.1lf\n",  lat,lng,alt,magx,roll,pitch);
            portEmulator.write(lat.toFixed(8) + ":" + lng.toFixed(8) + ":" + alt.toFixed(1) + ":" + magx.toFixed(1) + ":" + roll.toFixed(1) + ":" + pitch.toFixed(1) + "\n");
            portEmulator.close();
        });
        console.log('Executed cron');
    });
});
var emitter = new EventEmitter();
// const server = http.createServer((req, res) =>  {
//   res.writeHead(200);
//   Hello();
//   res.end('Salut tout le monde :) !');
//   emitter.emit('request',[req.headers])
//   ByeBye();
// });
// server.on('close',()=> console.log('Closign server'));
emitter.on('request', function () {
    var vars = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        vars[_i] = arguments[_i];
    }
    for (var _a = 0, vars_1 = vars; _a < vars_1.length; _a++) {
        var vari = vars_1[_a];
        console.log(vari);
    }
});
// server.listen(8080);
exports.default = app;
