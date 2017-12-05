/**
 * ImageHandler Class
 * Object used to store image's infos to a sql database and upload the images to the AWS cloud.
 */

import Configs from '../configs_for_tests';

const fs = require('fs');
const EventEmitter = require('events');
import MysqlWorker from "../mysql/mysql";
import logger from '../logger';

export default class ImageHandler {
    /**
     * Returned events :
     * error-folder-configuration
     * ok-folder-configuration
     * new-image-detected
     *
     * @type {"events".internal}
     */
    eventEmitter = new EventEmitter();
    dbCommunication: MysqlWorker;

    /**
     *
     * @param {any} configs object configurations
     * @param {boolean} configs.autoConfigure if true, the object is autoconfigured using configs.configs
     * @param {string} configs.configs.path the path to the image directory
     * @param {any} configs.mysqlConfigs the mysql configurations
     */
    constructor(configs) {
        if (configs.autoConfigure) {
            console.log('autoconfiguration')
        }
    }

    /**
     *Subscribe to file_path changes to execute bd update and aws sync when a image is saved in file_path
     * @param file_path the path to the folder in to which images will be saved.
     */
    public configureFolderListenner(file_path) {

        // testing that the folder exists
        const stats = fs.stat(file_path, (err, stats) => {
            if (err) {
                this.eventEmitter.emit('error-folder-configuration', err)
                return;
            }
        });
        const file_watcher = fs.watch(file_path);
        file_watcher.on('change', (file_name) => {
            console.log(file_name);
        })
    }


    /**
     * // todo : finish to comment
     * @param mysqlConfigs
     */
    public connectToDb(mysqlConfigs) {
        this.dbCommunication = new MysqlWorker({autoConnect: true, mysqlConfigs: mysqlConfigs});

        this.dbCommunication.eventEmitter.on('ok-connect', () => {
            logger.log('info', 'Mysql worker connected for ImageHandler');
            // we are connected to the database and we can open serial port
        });

        this.dbCommunication.eventEmitter.on('error-mysql-querywrite_image_props', () => {
                logger.log('error', 'Error on image props writting in db');
            }
        );

    }


    /**
     * Write metadata composed of the gps point and etape point to the db.
     * @param img_infos.img_src the path to the image
     */
    public writeMetaData(img_infos) {

    }

    public stop() {
        // closing connection to db
        this.dbCommunication.disconnect();
        this.dbCommunication = null;

        // removing listenners
        this.eventEmitter.removeAllListeners('error-folder-configuration').removeAllListeners('ok-folder-configuration').removeAllListeners('new-image-detected');

    }


}
