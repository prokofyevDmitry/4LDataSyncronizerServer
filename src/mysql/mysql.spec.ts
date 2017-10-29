import MysqlWorker from './mysql';

import Configs from '../configs_for_tests';
import {expect} from 'chai';
import 'mocha';


describe('Testing MysqlWorker', () => {

    it('Should emmit signal ok-connect', (done) => {
        const mysqlWorker = new MysqlWorker({autoConnect: false});
        mysqlWorker.connect(Configs.configs.dev.mysql_config);
        // if error =>
        mysqlWorker.eventEmitter.on('error-connect', (err) => {
            done(err);
        });
        // if ok =>
        mysqlWorker.eventEmitter.on('ok-connect', () => {
            done();
        });


    });

});