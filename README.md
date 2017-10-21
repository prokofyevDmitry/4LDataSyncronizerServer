# 4LDataSyncronizerServer
Node js server that receives images and data through Serial and Socket and sync it with a distant AWS instance. 

**Prerequisites**

-nodejs

-typescript



**Installation**

npm install


**Environnement**

In order to be able to simulate the com port and other (TODO) the environemental variable `NODE_ENV` must be set to `dev`.

While in production `NODE_ENV` must be equal to`prod`.

**Testing**

The components are tested using Mocha.

Two tests are available:
  * `npm run testProd` for production;
  * `npm run testDev` for developpement. 



