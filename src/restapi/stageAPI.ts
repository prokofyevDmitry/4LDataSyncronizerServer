/**
 API for communication with the ihm
 All communications are made via socket
 TODO: refactor this
 */
import * as http from "http";
import config from '../config';
import MysqlWorker from "../mysql/mysql"
import logger from '../logger';

const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');

// route configuration
const express = require('express');
const stageAPI = express.Router();
/**
 * Stage api:
 */


/**
 * Create a stage
 * Params:
 *  {
 *      departure:
 *      arrival:
 *  }
 */
stageAPI.post('/',
 [
        // path validation
        check('departure').exists().withMessage('No departure specifier'),
        check('arrival').exists().withMessage('No arrival specifier'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.mapped()})
        }
        // return only the values validated by the midleware
        const stage = matchedData(req);
        console.log(stage)

        //////////////////////// MYSQL ////////////////////////////
        const mysqlWorker = new MysqlWorker({autoConnect: true, mysqlConfigs: config.mysqlConfig});

        const queryName = "stage_insert";
        // response configuration
        mysqlWorker.eventEmitter.once('error-connect', () => {
            res.status(500).send("Erreur de connexion à la base de données");
        });
        mysqlWorker.eventEmitter.once('error-mysql-query' + queryName, () => {
          console.log('retrieved mysql error');
          res.status(500).send("Erreur de requette à la base de données");
        });
        mysqlWorker.eventEmitter.once('ok-mysql-query' + queryName, () => {
          console.log('retrieved mysql ok query');
            res.status(200).send();
        });


        const sql_request = "INSERT INTO etape (depart, arrivee) VALUES (?,?)";
        mysqlWorker.run_request(sql_request, queryName, [stage.departure,stage.arrival]);


    }
);


/**

Query that return all stages ordered by creation time.


*/
stageAPI.get('/',(req,res)=>{
  const mysqlWorker = new MysqlWorker({autoConnect: true, mysqlConfigs: config.mysqlConfig});

  const queryName = "get_insert";

  mysqlWorker.eventEmitter.once('error-connect', () => {
      res.status(500).send("Erreur de connexion à la base de données");
  });
  mysqlWorker.eventEmitter.once('error-mysql-query' + queryName, () => {
    res.status(500).send("Erreur de requette à la base de données");
  });
  mysqlWorker.eventEmitter.once('ok-mysql-query' + queryName, (result) => {
      res.status(200).send(result);
  });


  const sql_request = "SELECT *  FROM etape ;";
  mysqlWorker.run_request(sql_request, queryName);
})




export default stageAPI;
