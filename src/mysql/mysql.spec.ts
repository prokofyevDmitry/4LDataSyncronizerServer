import MysqlWorker from './mysql';
import Configs from '../configs_for_tests';
import {expect} from 'chai';
import 'mocha';


describe('Testing MysqlWorker', () => {

    let mysqlWorker = null;
    let config = null;
    before(() => {
        mysqlWorker = new MysqlWorker({autoConnect: false});
        config = new Configs();
    })

    it('Should emmit signal ok-connect', (done) => {
        mysqlWorker.connect(config.config.mysqlConfig);
        // if error =>
        mysqlWorker.eventEmitter.on('error-connect', (err) => {
            done(err);
        });
        // if ok
        mysqlWorker.eventEmitter.on('ok-connect', () => {
            done();
        });

        after(() => {
            mysqlWorker.disconnect()
        })

    });

});