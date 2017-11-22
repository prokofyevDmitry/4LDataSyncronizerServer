const env = process.env.NODE_ENV || 'dev';

const configs = {
    dev: {
        env: 'prod',
        comPort: {
            name: "COM5",
            configs: {
                //baudRate: 90600,
                autoOpen: false,
            }
        },

        portComEmulator: {
            name: "/dev/pts/7",
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


const config = configs[env];

export default config;
