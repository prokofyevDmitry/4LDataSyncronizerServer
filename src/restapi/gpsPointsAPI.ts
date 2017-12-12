
/**
 API for communication with the ihm
 */
import * as http from "http";
import config from '../config';
import MysqlWorker from "../mysql/mysql"
import logger from '../logger';

const {check, validationResult} = require('express-validator/check');
const {matchedData, sanitize} = require('express-validator/filter');

// route configuration
const express = require('express');
const gpsPointsAPI = express.Router();



/**
Query that return 100 gps points for the given rectangle 

*/
gpsPointsAPI.get('/',[
        // path validation
        check('stageId').exists().withMessage('No stage id specified'),
        check('neLat').exists().withMessage('neLat specified'),
        check('neLng').exists().withMessage('neLng specified'),
        check('swLat').exists().withMessage('swLat specified'),
        check('swLng').exists().withMessage('swLng specified'),
    ]
    ,(req,res)=>{
    	const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.mapped()})
        }

const request = matchedData(req);

logger.log('info', JSON.stringify(request));

  const mysqlWorker = new MysqlWorker({autoConnect: true, mysqlConfigs: config.mysqlConfig});

  let queryName = "gpsPoints_get";

  mysqlWorker.eventEmitter.once('error-connect', () => {
    mysqlWorker.disconnect();
      res.status(500).send("Erreur de connexion à la base de données");
  });
  mysqlWorker.eventEmitter.once('error-mysql-query' + queryName, () => {
    mysqlWorker.disconnect();
    res.status(500).send("Erreur de requette à la base de données");
  });
 
  mysqlWorker.eventEmitter.once('ok-mysql-query' + queryName, (result) => {

logger.log('info', result[0]['COUNT(*)']);
logger.log('info', JSON.stringify(result));

	const count = result[0]['COUNT(*)'];



	let ratio = Math.floor(parseFloat(count)/50);

	 const sql_request = "select * from pointgps where etape_id=? and lattitude <= ? and lattitude >= ? and longitude <= ? and longitude >= ? and id mod ? =0"

	 queryName = "selective_point_request"



	 mysqlWorker.eventEmitter.once('error-mysql-query' + queryName,()=>{
	 	mysqlWorker.disconnect();
    res.status(500).send("Erreur de requette à la base de données");
})

	 mysqlWorker.eventEmitter.once('ok-mysql-query' + queryName, (result) => {
mysqlWorker.disconnect();
      res.status(200).send(result);
	 })

	mysqlWorker.run_request(sql_request, queryName, [parseInt(request.stageId), parseFloat(request.neLat), parseFloat(request.swLat), parseFloat(request.neLng), parseFloat(request.swLng), ratio]);	 

  });


  // first request is to know how many point is there in the view 

  const sql_request = "select COUNT(*) from pointgps where etape_id=? and lattitude <= ? and lattitude >= ? and longitude <= ? and longitude >= ?"

 
  mysqlWorker.run_request(sql_request, queryName, [parseInt(request.stageId), parseFloat(request.neLat), parseFloat(request.swLat), parseFloat(request.neLng), parseFloat(request.swLng)]);
})


export default gpsPointsAPI;