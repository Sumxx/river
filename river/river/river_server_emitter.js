(function () {
    var Emitter = function () {
        this._callBack = {};
    };

    Emitter.prototype.on = function (event, fn) {
        this._callBack = this._callBack || {};
        var eventList = this._callBack[event];
        if (!eventList) {
            eventList = [];
        }

        eventList.push(fn);
    };

    Emitter.prototype.isEvent = function (event) {
        return this._callBack[event] ? true : false;
    };

    Emitter.prototype.emit = function (event) {
        var eventList = this._callBack[event];
        if (!eventList) {
            return null;
        }

        for (var i = 0; i < eventList.length; i++) {
            var callFn = eventList[i];
            if (!callFn) {
                continue;
            }

            river.util.callFunc(callFn, this, event, Array.prototype.slice.call(arguments, 1));
        }
        return this;
    };

    river.Emitter = Emitter;
})();