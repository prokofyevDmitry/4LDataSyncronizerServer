const env = process.env.NODE_ENV || 'dev';

const configs =
{
dev: {
    env : env,
    comPort : {
        name: "/dev/pts/11",
        configs: {
            //baudRate: 90600,
            autoOpen: false,
        }
},

    portComEmulator : {
            name: "/dev/pts/12",
            configs: {
                //baudRate: 90600,
                autoOpen: false
            }
        }

}
}


const config = configs[env];

export default config;

