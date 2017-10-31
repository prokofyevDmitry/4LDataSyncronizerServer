const mysql = require('mysql');
import config from '../config';
import logger from '../logger';

const EventEmitter = require('events');

/**
 * Represents a mysql connector able to make requests to a mysql database
 */
export default class MysqlWorker {
    // object variables
    private con;
    /**
     * Propertie used to return events affter acomplishing an asyncronous function like DB writing or connecting.
     * Returned events (name, data ):
     *      ('error-connect',err) : cannot connect to database
     *      ('ok-connect') : connected to database successfuly
     *      ('error-mysql-query') : error on mysql query
     *      ('ok-mysql-query') : ok on mysql query
     *
     * @type {"events".internal}
     */
    eventEmitter = new EventEmitter();

    /**
     * @class
     * @param {object} configs configs of the mysql worker
     *        {boolean} configs.autoConnect Should mysql worker connect right after the object is created ?
     *        {object } configs.mysqlConfigs configs of the mysql db to connect to.
     *
     */
    constructor(configs) {
        if (configs.autoConnect) {
            this.connect(configs.mysqlConfigs);
        }
    }

    public connect(mysqlConfigs) {
        this.con = mysql.createConnection(mysqlConfigs);
        this.con.connect((err) => {
            if (err) {
                this.eventEmitter.emit('error-connect', err);
                logger.log('error', 'Cannot connect to mysql server', {
                    error: err
                });
            }
            else this.eventEmitter.emit('ok-connect');
        })
    };


    /**
     *
     * @param {any} sql_req : the query string like : 'SELECT * FROM users WHERE id = ?'
     * @param {any} elements : the elements to populate the request : ex: [userId]
     */
    public run_request(sql_req: string, elements: Array<any>) {
        this.con.query(sql_req, elements, (error, results) => {
            if (error) {
                this.eventEmitter.emit('error-mysql-query');
                logger.log('error', 'mysql request error', {sql_req, elements, error});
                return;
            }
            logger.log('info', 'carphysics write to mysql OK');
            this.eventEmitter.emit('ok-mysql-query');
            return results;
        })
    }

    public disconnect() {
        this.con.end();
        // killing all listener for object events
        this.eventEmitter.removeAllListeners('error-connect').removeAllListeners('ok-connect').removeAllListeners('error-mysql-query').removeAllListeners('ok-mysql-query');
    }

}