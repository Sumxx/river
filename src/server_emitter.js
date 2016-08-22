(function () {
    var serverEmitter = new river.Emitter();

    var serverConfig = {
        host: "192.168.0.102",
        port: "3010"
    };

    river.connServer.login("!", "!", serverConfig.host, serverConfig.port, function (err) {

    });
})();