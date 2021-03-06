import * as SerialPort from 'serialport';
import logger from '../logger';
import MysqlWorker from "../mysql/mysql";
import * as http from "http";

const io = require('socket.io')(http);


const EventEmitter = require('events');

export default class CarPhysics {

    // object variables
    comPort: SerialPort;
    // expressing the states for the carphysics grabber
    state: string;
    // reconnexion timer
    // todo : review the state policy
    static states = ['running', 'writing-error-mysql'];
    dbCommunication: MysqlWorker;

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

            // socket configuration for api

        });
        let lat = 0, lng = 0, time = 0;
        // TODO : remove this
        // setInterval(() => {
        //     io.emit('gpsPoint', {lat: lat++, lng: lng++, time: time++});
        //     if (lat > 30)
        //         lat = 0, lng = 0, time = 0;
        //
        // }, 3000)
        io.listen(8000);


        // now the carphysics grabber is running
        this.state = CarPhysics.states[0];

    }


    public connectToDb(mysqlConfigs) {
        this.dbCommunication = new MysqlWorker({autoConnect: true, mysqlConfigs: mysqlConfigs});

        this.dbCommunication.eventEmitter.on('ok-connect', () => {
            logger.log('info', 'Mysql worker connected for CarPhysics');
        });
        this.dbCommunication.eventEmitter.on('error-mysql-querywrite_pointgps', () => {
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


        });

        this.comPort.once('close', (err) => {
            console.log('perte de connexion');
            // on test l'existance de
            console.log(err);

            if (err) {
                const self = this;
                let timerId = setTimeout(function find_com() {
                    SerialPort.list().then((res) => {
                        console.log('Grabed lists');
                        for (let com of res) {
                            if (serialConfigs.name == com.comName) {
                                console.log('reconnected')
                                self.connectToSerial(serialConfigs);
                                clearTimeout(timerId);
                                return;
                            }
                        }
                        timerId = setTimeout(find_com, 1000);
                    });
                }, 1000)


            }
        });


        // configuration for what happens with new datas
        parser.on('data', (data) => {
            logger.log('info', 'Recieved com data', {
                data: data
            });

            // we suppose that data is sended at 100 eps

            // parsing data as follow :
            //"%.8lf:%.8lf:%.1lf:%.1lf:%.1lf:%.1lf"
            //lat,lng,alt,magx,roll,pitch
            // writing the point to database with the current etape id
            const datas_to_parse = data.split(':');

            let json_data = {}
            if (datas_to_parse.length>4){
            json_data = {
                pitch: parseFloat(datas_to_parse[0]),
                roll: parseFloat(datas_to_parse[1]),
                yaw: parseFloat(datas_to_parse[2]),
                roll_dir: parseFloat(datas_to_parse[3]),
                filtre: parseFloat(datas_to_parse[4])
            }
           logger.log('info', 'Emitting phys event ', {
                data: json_data
            });
            io.emit('phys', json_data);
            this.writePhysDataToDb(data);
            }
            else{
                json_data = {
                lng: parseFloat(datas_to_parse[0]),
                lat: parseFloat(datas_to_parse[1]),
                alt: parseFloat(datas_to_parse[2]),
                speed: parseFloat(datas_to_parse[3])
                    }
            logger.log('info', 'Emitting geo event ', {
                data: json_data
            });
            io.emit('geo', json_data);
            this.writeGeoDataToDb(data);
            }

        });


    }


    // socket io configuration

    public writeGeoDataToDb(datas) {
        const sql_request = "INSERT INTO pointgps (longitude,lattitude, altitude, vitesse, etapeid) VALUES ( ?, ?, ?, ?, (SELECT id FROM etape WHERE time_depart IS NOT NULL AND time_arrivee IS NULL))";
        this.dbCommunication.run_request(sql_request, 'write_pointgps', datas.split(':'));
    }

    public writePhysDataToDb(datas) {
        const sql_request = "INSERT INTO physics (pitch, roll, yaw, roll_dir, filtre, etapeid) VALUES ( ?, ?, ?, ?, ?, (SELECT id FROM etape WHERE time_depart IS NOT NULL AND time_arrivee IS NULL))";
        this.dbCommunication.run_request(sql_request, 'write_pointgps', datas.split(':'));
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
