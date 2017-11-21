# 4LDataSyncronizerServer
Node js server that receives images and data through Serial and Socket and sync it with a distant AWS instance. 

##**Prerequisites**

-[Node JS](https://nodejs.org/en/download/)

-[typescript](https://www.npmjs.com/package/typescript)



**Installation**

`npm install` 


## **Environnement**

In order to be able to simulate the com port and other (TODO) the environemental variable `NODE_ENV` must be set to `dev`.

While in production `NODE_ENV` must be equal to`prod`.

## **Run**

### In emulation

For now the serial com is emulated. 
To enable emulation it you have to run `src/carphysics/com_simulation.sh`

The output will look like :
```
2017/11/15 15:52:23 socat[7410] N PTY is /dev/pts/9
2017/11/15 15:52:23 socat[7410] N PTY is /dev/pts/10
2017/11/15 15:52:23 socat[7410] N starting data transfer loop with FDs [5,5] and [7,7] 
```

The port number changes with each launch so you will have to modify config files : 
* In `src/configs_for_tests.ts ` and `src/configs.ts` ,on line `10` and `7` respectively,  change 
```javascript
name: "/dev/pts/1"`;
``` 
to
```javascript
name: "/dev/pts/9"`;
``` 
and line `19` change 
```javascript
name: "/dev/pts/6"`;
``` 
to
```javascript
name: "/dev/pts/10"`;
``` 


Then simply **run** the server 
```bash
npm start
```
The output should look like: 
```
info: Connected to serial and mysql for CarPhysics {}
info: Com port opened for CarPhysics {}
info: Mysql worker connected for CarPhysics {}
Executed cron
info: Recieved com data {"data":"-23.39346601:142.18672258:147.5:63.4:-147.0:-87.8"}
```

### With real  hardware
Connect your hadware to your pc. 

Copy the adresse of Serial Port.

Change the port in `src/configs_for_tests.ts ` and `src/configs.ts` ,on line `10` and `7` respectively,  change
```javascript
name: "/dev/pts/1"`;
``` 
to
```javascript
name: "YOUR_PORT_NUMBER"`;
```
and 
in `src/configs_for_tests.ts ` and `src/configs.ts` ,on line `9` and `5` respectively,  change
```javascript
env: env,
``` 
to
```javascript
env: 'prod',
```
**Testing**

The components are tested using Mocha.
`npm test`

## **Communication**
Number of sockets are used to communicate with a HMI

* Port `8000` : socket for Carphysics emmiting `'info',data` socket message
* Port `8001` : socket for logger emmiting `'logs',data` socket message





