import * as SerialPort from 'serialport';
export default class CarPhysics {

    // object variables
    comPort: SerialPort;

    constructor(comPort) {
        comPort =  new SerialPort(comPort.name, comPort.configs);
    }


    public test () {
        return ('test');
    }

    //
//
//     const port = new SerialPort(t.portCom.name, config.portCom.configs);
// //parser configuration
//     const parser = new SerialPort.parsers.Readline();
//     port.pipe(parser);
//     port.open((err) => {
//     if (err) return console.log('Error opening port: ', err.message);
//     // enregistrmenet pour utilisation du com port plus tard.
//     console.log("Port Openned")
//     app.set('portCom', port);
//
// });
// parser.on('data', (data)=> {
//     console.log(data);
// });


}


