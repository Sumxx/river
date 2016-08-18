(function () {
    var emitter = function () {
        this._callBack = {};
    };

    emitter.prototype.on = function (event, fn) {
        this._callBack = this._callBack || {};
        var eventList = this._callBack[event];
        if (!eventList) {
            eventList = [];
        }

        eventList.push(fn);
    };
    
    emitter.prototype.emit = function (event) {
        
    };
    
    emitter.prototype.off = function (event, fn) {
        
    };

    emitter.prototype.listeners = function (event, fn) {

    };

    emitter.prototype.hesListeners = function (event, fn) {

    };

    river.emitter = emitter;
})();