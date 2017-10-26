const mysql = require('mysql');
import config from './config';
const EventEmitter = require('events');
export default class MysqlWorker{
    // object variables
    con;
    eventEmitter = new EventEmitter();

    constructor(configs){
        if (configs.AutoConnect){
            this.connect();
        }
    }

    connect(){
    this.con = mysql.createConnection(config.mysql_config);
    this.con.connect((err)=>{
        if(err) this.eventEmitter.emit('error-connect',err);
        else this.eventEmitter.emit('ok-connect');

    })
    }

    disconnect(){

    }
}