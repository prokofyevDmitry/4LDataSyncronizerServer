const mysql = require('mysql');
import config from './config';
import logger from './logger';

const EventEmitter = require('events');
export default class MysqlWorker {
    // object variables
    private con;
    eventEmitter = new EventEmitter();

    constructor(configs) {
        if (configs.AutoConnect) {
            this.connect();
        }
    }

    public connect() {
        this.con = mysql.createConnection(config.mysql_config);
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
            return results;
        })
    }

    public disconnect() {
        this.con.disconnect();
    }

}