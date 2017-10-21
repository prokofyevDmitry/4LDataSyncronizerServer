import CarPhysics from './carPhysics';

const config = require('../config');
import {expect} from 'chai';
import 'mocha';


const carPhysics = new CarPhysics(config.comPort);

describe('Test function car physics', () =>{

    it('Should return test', ()=>{
        const result = carPhysics.test();
        expect(result).to.equal('test');
        });

});