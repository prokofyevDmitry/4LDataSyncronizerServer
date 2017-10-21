import CarPhysics from './carPhysics';
import {expect} from 'chai';
import 'mocha';

import config from '../config';
console.log(config);



const carPhysics = new CarPhysics(config.comPort);

describe('Test function car physics', () =>{

    it('Should return test', ()=>{
        const result = carPhysics.test();
        expect(result).to.equal('test');
        });

});