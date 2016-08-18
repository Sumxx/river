(function () {
    var connectServerConfig = {
        host: '127.0.0.1',
        port: '60222',
        log: true
    };

    var connServer = {};
    connServer.isInit = false;
    
    var createPlayerEvent = function () {
        
    };

    var callMessageEvent = function () {

    };
    
    var closeConn = function () {
        
    };

    var logoff = function () {

    };

    var login = function (name, password, host, port, cb) {
        var route = 'river.handler.login';
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
    
    var loginSectionServer = function (name, password, host, port, token, cb) {
        var route = 'river.handler.section';
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
        pomelo.on('createPlayerEvent', createPlayerEvent);
        pomelo.on('callMessageEvent', callMessageEvent);
        pomelo.on('closeConn', closeConn);
        pomelo.on('logoff', logoff);
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