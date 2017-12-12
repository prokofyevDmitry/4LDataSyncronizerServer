// /**
//  * Test suite for imageHandler Object.
//  * Requires a 'testimg.jpeg' file in the same folder to run tests on image processing functions
//  */
// import Configs from '../configs_for_tests';
// import MysqlWorker from '../mysql/mysql'
// import {expect} from 'chai';
// import ImageHandler from './imageHandler';
// import 'mocha';
//
// const {exec} = require('child_process');
// const fs = require('fs');
//
// describe('Testing imageHandler', () => {
//
//     let imageHandler = null;
//
//     before(() => {
//         // creating new image handler object with out configuration
//         // we'll configure the object as we execute tests
//         imageHandler = new ImageHandler({autoConfigure: false});
//
//         // deleting the test image folder if it was created by another test
//         exec('rm -Rf ' + Configs.configs.dev.imageHandlerConfig.testPath, (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`exec error: ${error}`);
//                 return;
//             }
//         });
//
//         // creating a test folder in to which we'll save the test images
//         try {
//             fs.mkdirSync(Configs.configs.dev.imageHandlerConfig.testPath);
//         }
//         catch (err) {
//             console.log(err);
//             // some thing went wrong on file creation
//             throw err;
//         }
//     });
//
//     // configuration of the watcher on folder that will contain images
//     const file_configurations = [
//         {
//             result: "INcorrectly",
//             path: "this/is/a/wrong/path"
//         },
//         {
//             result: "correctly",
//             path: Configs.configs.dev.imageHandlerConfig.testPath
//         },
//     ];
//     file_configurations.forEach((file_configuration) => {
//         it(`should configure ${file_configuration.result} the folder with images`, function (done) {
//             imageHandler.configureFolderListenner(file_configuration.path);
//
//             if (file_configuration.result == "INcorrectly") {
//                 // the right result will be if the folder configuration FAIL when given wrong path
//                 imageHandler.eventEmitter.on('error-folder-configuration', (err) => {
//                     done();
//                 });
//
//                 setTimeout(() => done('error : folder configuration should fail'), 500);
//             }
//             else {
//                 // the right result will be if the folder configuration SUCCEED when given right path
//                 imageHandler.eventEmitter.on('ok-folder-configuration', (err) => {
//                     done(err);
//                 });
//                 setTimeout(() => done(), 500);
//             }
//         })
//     });
//
// // image addition testing
//     it('should not find an available image to pre-store', function (done) {
//         // nothing will happen since there is no file created
//         imageHandler.eventEmitter.on('new-image-detected', () => {
//             done('error');
//         });
//         setTimeout(done, 1000);
//     });
//
//
//     it('should  find an available image to pre-store', function (done) {
//         // the event new-image-detected should fire when a image is copied to the 'path'
//         imageHandler.eventEmitter.on('new-image-detected', () => {
//             done();
//         });
//
//
//         fs.copyFileSync(__dirname + '/testimg.jpeg', Configs.configs.dev.imageHandlerConfig.testPath + '/testimg.jpeg');
//
//         setTimeout(() => {
//             done(new Error('the filechange was not captured'));
//         }, 1000);
//     });
//
// // should connect to db correctly
//     // TODO : add test for bad connection to DB.
//     it('should connect properly to db', function (done) {
//         imageHandler.connectToDb(Configs.configs.dev.mysqlConfig);
//         imageHandler.dbCommunication.eventEmitter.on('error-connect', (err) => {
//             done(err);
//         });
//         imageHandler.dbCommunication.eventEmitter.on('ok-connect', () => {
//             done();
//         });
//     });
//
//
// // test image metadata write to SQL database
//     /*
//     After insertion, we query data from sql database and compare them with what should be meaning:
//         The etape_idetape1 should be equal to the last opened etape
//         The point_gps_idpointgps should be equal to the last point_gps_idpointgps
//         The uploaded should be false.
//      */
//     it('should write meta data of the image to mysql database', function (done) {
//
//         imageHandler.writeMetaData({
//             img_src: Configs.configs.dev.imageHandlerConfig.testPath + '/testimg.jpeg',
//
//         });
//         imageHandler.dbCommunication.eventEmitter.on('error-mysql-query', (err) => {
//             done(err);
//         });
//         imageHandler.dbCommunication.eventEmitter.once('ok-mysql-query', () => {
//
//             const mysqlWorker = new MysqlWorker({autoConfigure: true, mysqlConfigs: Configs.configs.dev.mysqlConfig});
//             let etapeid;
//             let pointid;
//             // query the last etape_idetape1
//             const sql_get_last_etape = "SELECT idetape FROM etape ORDER BY time DESC LIMIT 1";
//             mysqlWorker.run_request(sql_get_last_etape);
//             mysqlWorker.eventEmitter.once('ok-mysql-query', (data) => {
//                 etapeid = data[0].etapeid;
//                 // we diassociate the listenner from the even
//
//                 const sql_get_last_gpspoint = `SELECT idpointgps FROM pointgps WHERE etape_idetape=${etapeid} ORDER BY time DESC LIMIT 1`;
//                 mysqlWorker.run_request(sql_get_last_gpspoint);
//                 mysqlWorker.eventEmitter.once('ok-mysql-query', (data) => {
//                     pointid = data.etapeid;
//
//                     // we query the last insertion in the db
//                     const sql_get_last_image_data = `SELECT * FROM image ORDER BY time DESC LIMIT 1`
//                     mysqlWorker.run_request(sql_get_last_image_data);
//                     mysqlWorker.eventEmitter.once('ok-mysql-query', (data) => {
//                         const image_data = data[0];
//                         if (image_data.etape_idetape1 == etapeid && image_data.pointgps_idpointgps == pointid && image_data.uploaded == false) {
//                             done();
//                         }
//                         else {
//                             done('Written values are not right')
//                         }
//                     })
//                 });
//             });
//         });
//
//     });
//
//     after(() => {
//
//         fs.unlink(Configs.configs.dev.imageHandlerConfig.testPath);
//
//
//         imageHandler.stop();
//
//
//         imageHandler = null;
//
//
//     })
//
// })
