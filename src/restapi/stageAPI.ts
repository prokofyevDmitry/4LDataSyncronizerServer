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

import {calculateAverageSpeed, calculateDistance} from "../funcs/geocalc";

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
            mysqlWorker.disconnect();
            res.status(500).send("Erreur de connexion à la base de données");
        });
        mysqlWorker.eventEmitter.once('error-mysql-query' + queryName, () => {
            console.log('retrieved mysql error');
            mysqlWorker.disconnect();
            res.status(500).send("Erreur de requette à la base de données");
        });
        mysqlWorker.eventEmitter.once('ok-mysql-query' + queryName, () => {
            console.log('retrieved mysql ok query');
            mysqlWorker.disconnect();
            res.status(200).send();
        });


        const sql_request = "INSERT INTO etape (depart, arrivee) VALUES (?,?)";


        mysqlWorker.run_request(sql_request, queryName, [stage.departure, stage.arrival]);


    }
);


// return infos about the stage : 
// the average speed
// the elevation 
// the total distance
// given the hight number of datas the request might be slow to process
stageAPI.get('/:stage_id/infos', [
    check('stage_id').exists().withMessage('No stage_id specifier')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.mapped()})
    }

    const stage = matchedData(req);


    const mysqlWorker = new MysqlWorker({autoConnect: true, mysqlConfigs: config.mysqlConfig});

    const queryName = "points_get";

    mysqlWorker.eventEmitter.once('error-connect', () => {
        mysqlWorker.disconnect();
        res.status(500).send("Erreur de connexion à la base de données");
    });
    mysqlWorker.eventEmitter.once('error-mysql-query' + queryName, () => {
        mysqlWorker.disconnect();
        res.status(500).send("Erreur de requette à la base de données");
    });
    mysqlWorker.eventEmitter.once('ok-mysql-query' + queryName, (result) => {
        mysqlWorker.disconnect();

        // calculate all informations from gps points
        const calcAvSpeedProm = calculateAverageSpeed(result);
        const calcDistProm = calculateDistance(result);
        Promise.all([calcAvSpeedProm, calcDistProm]).then(values => {
            res.status(200).send({
                avSpeed: values[0],
                dist: values[1]
            });

        })


    });

    const sql_request = "SELECT *  FROM pointgps where etape_id=?;";
    mysqlWorker.run_request(sql_request, queryName, [stage.stage_id]);

});

/**
 Query that return all stages ordered by creation time.
 */
stageAPI.get('/', (req, res) => {
    const mysqlWorker = new MysqlWorker({autoConnect: true, mysqlConfigs: config.mysqlConfig});

    const queryName = "stages_get";

    mysqlWorker.eventEmitter.once('error-connect', () => {
        mysqlWorker.disconnect();
        res.status(500).send("Erreur de connexion à la base de données");
    });
    mysqlWorker.eventEmitter.once('error-mysql-query' + queryName, () => {
        mysqlWorker.disconnect();
        res.status(500).send("Erreur de requette à la base de données");
    });
    mysqlWorker.eventEmitter.once('ok-mysql-query' + queryName, (result) => {
        mysqlWorker.disconnect();
        res.status(200).send(result);
    });

    const sql_request = "SELECT *  FROM etape ;";
    mysqlWorker.run_request(sql_request, queryName);
})


/**
 Select all points for a given stage
 * Params:
 *  {
 *      stageId
 *  }
 **/
stageAPI.get('/pointsgps', [
    // path validation
    check('stageId').isInt().withMessage('stageId not an int, please provide one')
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.mapped()})
    }

    const stage = matchedData(req);

    const mysqlWorker = new MysqlWorker({autoConnect: true, mysqlConfigs: config.mysqlConfig});

    const queryName = "get_pointsgps"

    mysqlWorker.eventEmitter.once('error-connect', () => {
        mysqlWorker.disconnect();
        res.status(500).send("Erreur de connexion à la base de données");
    });
    mysqlWorker.eventEmitter.once('error-mysql-query' + queryName, () => {
        mysqlWorker.disconnect();
        res.status(500).send("Erreur de requette à la base de données");
    });
    mysqlWorker.eventEmitter.once('ok-mysql-query' + queryName, (result) => {
        mysqlWorker.disconnect();
        res.status(200).send(result);
    });

    const sql_request = "SELECT * FROM pointgps WHERE idpointgps = ?;";
    mysqlWorker.run_request(sql_request, queryName, [stage.stageId]);

})


export default stageAPI;
