import MysqlWorker from './mysql';
import Configs from '../configs_for_tests';
import {expect} from 'chai';
import 'mocha';


describe('Testing MysqlWorker', () => {

    let mysqlWorker;
    before(() => {
        mysqlWorker = new MysqlWorker({autoConnect: false});
    })

    it('Should emmit signal ok-connect', (done) => {
        mysqlWorker.connect(Configs.configs.dev.mysqlConfig);
        // if error =>
        mysqlWorker.eventEmitter.on('error-connect', (err) => {
            done(err);
        });
        // if ok =>
        mysqlWorker.eventEmitter.on('ok-connect', () => {
            done();
        });

        after(() => {
            mysqlWorker.disconnect()
        })

    });

});