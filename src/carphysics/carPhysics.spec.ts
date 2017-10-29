import CarPhysics from './carPhysics';
import Configs from '../configs_for_tests';
import {expect} from 'chai';
import 'mocha';

const carPhysics = new CarPhysics(Configs.configs.dev.comPort);

describe('Testing CarPhysics', () => {

    it('Should return test', () => {
        const result = carPhysics.test();
        expect(result).to.equal('test');
    });

});