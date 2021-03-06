import CarPhysics from './carPhysics';
import Configs from '../configs_for_tests';
import {expect} from 'chai';
import 'mocha';


describe('Testing CarPhysics', () => {

    let carPhysics = null;
    let config = null;
    before(() => {
        // Create a new Rectangle object before every test.

        carPhysics = new CarPhysics({
            autoConfigure: false
        });

        config = new Configs();

    });


    it('Should return test', () => {
        const result = carPhysics.test();
        expect(result).to.equal('test');
    });

    it('Should connect to mysql server', (done) => {

        carPhysics.connectToDb(config.config.mysqlConfig);
        carPhysics.dbCommunication.eventEmitter.on('error-connect', (err) => {
            done(err);
        });
        carPhysics.dbCommunication.eventEmitter.on('ok-connect', () => {
            done();
        });
    });

    it('Should connect to serial com', (done) => {

        carPhysics.connectToSerial(config.config.comPort);

        carPhysics.eventEmitter.on('error-serial', (err) => {
            done(err);
        });
        carPhysics.eventEmitter.on('ok-serial', () => {
            done();
        });
    })

    it('Should run well a MYSQL insertion', (done) => {
        carPhysics.writeDataToDb("14.0:15.10:1400:245:140:360");
        carPhysics.dbCommunication.eventEmitter.on('error-mysql-query', (err) => {
            done(err);
        });
        carPhysics.dbCommunication.eventEmitter.on('ok-mysql-query', (err) => {
            done();
        });

    })

    after(() => {
        carPhysics.stop();
        carPhysics = null;
    })


});

