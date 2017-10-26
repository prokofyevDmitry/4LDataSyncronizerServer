const env = process.env.NODE_ENV || 'dev';

const configs =
{
dev: {
    env : env,
    comPort : {
        name: "/dev/pts/19",
        configs: {
            //baudRate: 90600,
            autoOpen: false,
        }
},

    portComEmulator : {
            name: "/dev/pts/20",
            configs: {
                //baudRate: 90600,
                autoOpen: false
            }
        },
    mysql_config: {
        host: "localhost",
        user: "root",
        password: "root",
        database: '4LDB'
    }

}
}


const config = configs[env];

export default config;

