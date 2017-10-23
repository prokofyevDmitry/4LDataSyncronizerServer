import * as SerialPort from 'serialport';
import RestApi from '../restapi/restApi';

export default class CarPhysics {

    // object variables
    comPort: SerialPort;
    api: RestApi;

    constructor(comPort) {

        console.log(comPort);
        // port configuration
        comPort = new SerialPort(comPort.name, comPort.configs);
        const parser = new SerialPort.parsers.Readline();
        comPort.pipe(parser);
        comPort.open((err) => {
            if (err) return console.log('Error opening port: ', err.message);
            // enregistrmenet pour utilisation du com port plus tard.
            console.log("Port Openned")

        })



    }


    public test() {
        return ('test');
    }

    //
//

//
// });
// parser.on('data', (data)=> {
//     console.log(data);
// });


}


