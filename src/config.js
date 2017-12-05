var Config = (function () {
    function Config() {
        this.portCom = {
            name: "/dev/pts/12",
            configs: {
                //baudRate: 90600,
                autoOpen: false,
            },
            portComEmulator: portComEmulator
        };
        this.default = Config;
    }
    return Config;
}());
