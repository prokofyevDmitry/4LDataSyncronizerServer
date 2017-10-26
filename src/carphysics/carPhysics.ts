import * as SerialPort from 'serialport';

import RestApi from '../restapi/restApi';
import MysqlWorker from "../mysql";
const EventEmitter = require('events');

export default class CarPhysics {

    // object variables
    comPort: SerialPort;
    dbCommunication : MysqlWorker;
    api: RestApi;
    eventEmitter = new EventEmitter();
    constructor(comPort) {

        console.log(comPort);
        // port configuration
        comPort = new SerialPort(comPort.name, comPort.configs);
        this.dbCommunication = new MysqlWorker({AutoConnect:true});

        // error handling db
        this.dbCommunication.eventEmitter.on('error-connect',(err)=>{
            // we cannot store elements in database, we have to alert the user
            this.eventEmitter.emit('error-mysql',err);
        });

        this.dbCommunication.eventEmitter.on('ok-connect',()=>{
           // we are connected to the database and we can open serial port
            const parser = new SerialPort.parsers.Readline();
            comPort.pipe(parser);
            comPort.open((err) => {
                // error handling if the port is not open
                // The error is propagated, so the main function do not use
                // CarPhysics anymore
                if (err) {
                    this.eventEmitter.emit('error-serial', err);
                    return;
                }
                // enregistrmenet pour utilisation du com port plus tard.
                console.log("Port Openned");
                parser.on('data', (data) => {
                    console.log(data);
                    // write data to
                });

            });

        });


        // init mysql communication


    }


    public test() {
        return ('test');
    }

    //
//

//
// });


}


