(function () {
    var EmitterMgr = function () {
        this._emitterList = [];
    };

    EmitterMgr.prototype.add = function (emitter) {
        if (!emitter) {
            return;
        }

        this._emitterList.push(emitter);
    };

    EmitterMgr.prototype.remove = function (emitter) {
        if (!emitter) {
            return;
        }

        for (var i = 0; i < this._emitterList; i++) {
            var item = this._emitterList[i];
            if (!item) {
                continue;
            }

            if (item === emitter) {
                this._emitterList.splice(i, 1);
                break;
            }
        }
    };

    EmitterMgr.prototype.emit = function (event) {
        if (!event) {
            return;
        }

        for (var i = 0; i < this._emitterList; i++) {
            var item = this._emitterList[i];
            if (!item) {
                continue;
            }

            if (item.isEvent(event)) {
                item.emit(event);
            }
        }
    };

    river.emitterMgr = new EmitterMgr();
})();