import * as SerialPort from 'serialport';
import logger from '../logger';
import RestApi from '../restapi/restApi';
import MysqlWorker from "../mysql/mysql";
import * as http from "http";

const io = require('socket.io')(http);


const EventEmitter = require('events');

export default class CarPhysics {

    // object variables
    comPort: SerialPort;
    // expressing the states for the carphysics grabber
    state: string;
    // todo : review the state policy
    static states = ['running', 'writing-error-mysql'];
    dbCommunication: MysqlWorker;
    api: RestApi;
    /**
     * Propertie used to return events affter acomplishing an asyncronous function like DB writing or connecting.
     * Returned events (name, data ):
     *      ('error-serial', err) : cannot connect to serial
     *      ('ok-serial') : connected to serial
     *      ('error-mysql-query') : error on mysql query
     *
     * @type {"events".internal}
     */
    eventEmitter = new EventEmitter();

    /**
     * Constructor that init and configure events for the serial com, connect to db and configure error handling events.
     * @class
     * @param {object} configs configurations for the CarPhysics object
     * @param {boolean} configs.autoConfigure
     * @param {object} configs.comPort serialnode configuration
     * @param {object} configs.mysqlConfigs mysql configuration in order to connect to db and store recieved datas from serial.
     */
    constructor(configs) {
        // port configuration

        // create worker and connect to DB
        if (configs.autoConfigure) {
            this.connectToDb(configs.mysqlConfigs);
            this.connectToSerial(configs.comPort);
        }


        // handling writing to DB error, we propagate it to index JS the client

        // socket configuration
        io.on('connection', function (socket) {
            console.log('a user connected for car physics');
        });
        io.listen(8000);

        // now the carphysics grabber is running
        this.state = CarPhysics.states[0];

    }


    public connectToDb(mysqlConfigs) {
        this.dbCommunication = new MysqlWorker({autoConnect: true, mysqlConfigs: mysqlConfigs});

        this.dbCommunication.eventEmitter.on('ok-connect', () => {

            logger.log('info', 'Mysql worker connected for CarPhysics');
            // we are connected to the database and we can open serial port

        });

        this.dbCommunication.eventEmitter.on('error-mysql-query', () => {
                this.state = CarPhysics.states[2];
            }
        );

    }

    /**
     * Connect and configure the serial communication
     * The mysql configuration should be donne before recieving the data via serial or writeDataToDb will fail
     * @param serialConfigs com port configurations
     */
    public connectToSerial(serialConfigs) {
        const parser = new SerialPort.parsers.Readline();
        this.comPort = new SerialPort(serialConfigs.name, serialConfigs.configs);
        this.comPort.pipe(parser);
        this.comPort.open((err) => {
            // error handling if the port is not open
            // The error is propagated, so the main function do not use
            // CarPhysics anymore
            if (err) {
                this.eventEmitter.emit('error-serial', err);
                console.log("eroor connection : " + err);
                return null;
            }

            // enregistrmenet pour utilisation du com port plus tard.
            this.eventEmitter.emit('ok-serial');
            logger.log('info', 'Com port opened for CarPhysics');


            // configuration for what happens with new datas
            parser.on('data', (data) => {
                logger.log('info', 'Recieved com data', {
                    data: data
                });
                // parsing data as follow :
                //"%.8lf:%.8lf:%.1lf:%.1lf:%.1lf:%.1lf"
                //lat,lng,alt,magx,roll,pitch
                // writing the point to database with the current etape id
                const datas_to_parse = data.split(':');
                const json_data = {
                    lat: datas_to_parse[0],
                    lng: datas_to_parse[1],
                    alt: datas_to_parse[2],
                    magx: datas_to_parse[3],
                    roll: datas_to_parse[4],
                    pitch: datas_to_parse[5]
                }
                io.emit('info', json_data);
                this.writeDataToDb(data);

            });
        });
    }

    // socket io configuration

    public writeDataToDb(datas) {
        const sql_request = "INSERT INTO pointgps (lattitude, longitude, altitude, magx, roll, pitch, etape_idetape) VALUES ( ?, ?, ?, ?, ?, ?, (SELECT idetape FROM etape WHERE time_depart IS NOT NULL AND time_arrivee IS NULL))";
        this.dbCommunication.run_request(sql_request, datas.split(':'));
    }


    public stop() {
        // closing connection to db
        this.dbCommunication.disconnect();
        this.dbCommunication = null;
        // closing serial communication
        if (this.comPort.isOpen)
            this.comPort.close();

        // removing listeners
        this.eventEmitter.removeAllListeners('error-serial').removeAllListeners('ok-serial');

    }

    public test() {
        return ('test');
    }

    //
//

//
// });


}


