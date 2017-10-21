let config =   {
    comPort : {
        name: "/dev/pts/12",
        configs: {
            //baudRate: 90600,
            autoOpen: false,
        }
},

    portComEmulator : {
            name: "/dev/pts/13",
            configs: {
                //baudRate: 90600,
                autoOpen: false
            }
        }

}

export default config;

