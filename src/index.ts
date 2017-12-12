//var http = require('http');import * as http from 'http'
//import EventEmitter from 'events';
import express = require('express');
import config from './config';
import logger from './logger';

const schedule = require('node-schedule');

import session = require('express-session');
import CarPhysics from './carphysics/carPhysics';
import * as SerialPort from 'serialport';

// import api routes
import stageAPI from './restapi/stageAPI';
import gpsPointsAPI from './restapi/gpsPointsAPI'



const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')


app.use(bodyParser.json());
app.use(cors())
// api configuration
app.use('/stage', stageAPI);
app.use('/gpsPoints', gpsPointsAPI);



app.post('/',(req,res)=>{
  console.log(req.body);
  return res.status(200);
})


app.listen(8080, () => {

    const carPhysics = new CarPhysics({
        autoConfigure: true,
        comPort: config.comPort,
        mysqlConfigs: config.mysqlConfig
    });
    // car physics event handling
    // error connecting serial
    carPhysics.eventEmitter.on('error-serial', (err) => {
        logger.log('error', 'Cannot connect to serial communication', {
            error: err
        });
        
        logger.log('info', 'The CarPhysics will not be tracked');
        carPhysics.stop();
    });

    // error connection to db
    carPhysics.dbCommunication.eventEmitter.on('error-connect', () => {
        logger.log('info', 'The CarPhysics will not be tracked');
    });

    //

    // well connected serial
    carPhysics.eventEmitter.on('ok-serial', () => {
        logger.log('info', 'Connected to serial and mysql for CarPhysics');
        // if we are in dev environement we simulate a second port
        if (config.env === 'dev') {
            //     // launching cron job to give emulate data from axcelerometer
            const rule = new schedule.RecurrenceRule();

            rule.second = new schedule.Range(0, 59, 1);
            schedule.scheduleJob(rule, () => {
                const portEmulator = new SerialPort(config.portComEmulator.name, config.portComEmulator.configs);
                portEmulator.open((err) => {
                    if (err) return console.log('Error opening port: ', err.message);
                    // generation des messages aléatoires
                    const lat = ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 ) * 90 * Math.random();
                    const lng = ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 ) * 180 * Math.random();

                    const alt = ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 ) * 2000 * Math.random();

                    const magx = 360 * Math.random();

                    const roll = ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 ) * 180 * Math.random();

                    const pitch = ( ( Math.round(Math.random()) === 0 ) ? -1 : 1 ) * 180 * Math.random();


//            pc.printf("%.8lf:%.8lf:%.1lf:%.1lf:%.1lf:%.1lf\n",  lat,lng,alt,magx,roll,pitch);

                    portEmulator.write(`${lat.toFixed(8)}:${lng.toFixed(8)}:${alt.toFixed(1)}:${magx.toFixed(1)}:${roll.toFixed(1)}:${pitch.toFixed(1)}\n`);
                    portEmulator.close();
                });
                console.log('Executed cron')
            });
        }


    });

});
