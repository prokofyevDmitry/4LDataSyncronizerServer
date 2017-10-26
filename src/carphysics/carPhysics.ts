import * as SerialPort from 'serialport';
import logger from '../logger';
import RestApi from '../restapi/restApi';
import MysqlWorker from "../mysql";

const EventEmitter = require('events');

export default class CarPhysics {

    // object variables
    comPort: SerialPort;
    // expressing the states for the carphysics grabber
    state: string;
    static states = ['running', 'writing-error-mysql'];
    dbCommunication: MysqlWorker;
    api: RestApi;
    eventEmitter = new EventEmitter();

    constructor(comPort) {

        console.log(comPort);
        // port configuration
        comPort = new SerialPort(comPort.name, comPort.configs);
        this.dbCommunication = new MysqlWorker({AutoConnect: true});

        // error handling db
        this.dbCommunication.eventEmitter.on('error-connect', (err) => {
            // we cannot store elements in database, we have to alert the user
            this.eventEmitter.emit('error-mysql', err);
        });

        this.dbCommunication.eventEmitter.on('ok-connect', () => {

            logger.log('info', 'Mysql worker connected for CarPhysics');
            // we are connected to the database and we can open serial port
            const parser = new SerialPort.parsers.Readline();
            comPort.pipe(parser);
            comPort.open((err) => {
                // error handling if the port is not open
                // The error is propagated, so the main function do not use
                // CarPhysics anymore
                if (err) {
                    this.eventEmitter.emit('error-serial', err);
                    return null;
                }
                // enregistrmenet pour utilisation du com port plus tard.

                this.eventEmitter.emit('ok-serial');
                logger.log('info', 'Com port opened for CarPhysics');

                parser.on('data', (data) => {
                    logger.log('info', 'Recieved com data', {
                        data: data
                    });
                    // parsing data as follow :
                    //"%.8lf:%.8lf:%.1lf:%.1lf:%.1lf:%.1lf"
                    //lat,lng,alt,magx,roll,pitch

                    // writing the point to database with the current etape id
                    const sql_request = "INSERT INTO pointgps (lattitude, longitude, altitude, magx, roll, pitch, etape_idetape) VALUES ( ?, ?, ?, ?, ?, ?, (SELECT idetape FROM etape WHERE time_depart IS NOT NULL AND time_arrivee IS NULL))";
                    this.dbCommunication.run_request(sql_request, data.split(':'));

                });
            });
        });

        // handling writing to DB error, we propagate it to index JS the client
        this.dbCommunication.eventEmitter.on('error-mysql-query', () => {
                this.state = CarPhysics.states[2];
            }
        );

        // now the carphysics grabber is running
        this.state = CarPhysics.states[0];

    }


    public stop() {
        // closing connection to db
        this.dbCommunication.disconnect();
        // closing serial communication
        this.comPort.disconnect();
    }

    public test() {
        return ('test');
    }

    //
//

//
// });


}


