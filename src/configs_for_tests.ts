// in this file the configs are a class so they can be instantiated via import statement with mocha tests.
// This is necessary because mocha seems unable to import an object like the configs in "config.ts"

const env = process.env.NODE_ENV || 'dev';

export default class Configs {

    static configs = {
        dev: {
            env: env,
            comPort: {
                name: "/dev/pts/1",
                configs: {
                    //baudRate: 90600,
                    autoOpen: false,
                }
            },

            portComEmulator: {
                name: "/dev/pts/6",
                configs: {
                    //baudRate: 90600,
                    autoOpen: false
                }
            },
            mysqlConfig: {
                host: "localhost",
                user: "root",
                password: "root",
                database: '4LDB'
            }

        }
    }


}





