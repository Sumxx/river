(function () {
    var connServer = {};
    connServer.isInit = false;

    var eventEmitter = new river.Emitter();
    river.emitterMgr.add(eventEmitter);

    var callMessageEvent = function (name) {
        var params = Array.prototype.slice.call(arguments, 1);
        river.emitterMgr.emit(name, params);
    };

    var login = function (name, password, host, port, cb) {
        var route = 'connector.entryHandler.login';
        pomelo.init({host: host, port: port}, function () {
            pomelo.request(route, {name: name, password: password}, function (req) {
                pomelo.disconnect();
                if (!req.code) {
                    return;
                }
                river.util.callFunc(cb, "river");
            });
        });
    };
    
    var loginSectionServer = function (name, password, host, port, token, cb) {
        var route = 'connector.handler.section';
        pomelo.init(host, port, function () {
            pomelo.request(route, {name: name, password: password}, function (req) {
                pomelo.disconnect();
                if (!req.code) {
                    return;
                }
                river.util.callFunc(cb, "river");
            });
        });
    };

    var initServerMessageHandler = function () {
        pomelo.on('river.event', callMessageEvent);
    };

    connServer.login = function (name, password, host, port, cb) {
        if (!connServer.isInit) {
            initServerMessageHandler();
        }

        login(name, password, host, port, function (err, host, port, token) {
            if (!err) {
                river.util.callFunc(cb, err);
                return;
            }

            loginSectionServer(name, password, host, port, token, function (err) {
                river.util.callFunc(cb, err);
            });
        });
    };

    river.connServer = connServer;
})();