(function () {
    river.ViewMgr = cc.Class.extend({
        _viewMap: null,
        _eventMap: null,

        ctor: function () {
            this._viewMap = {};
            this._eventMap = {};
        },

        eventMessage: function (name, data) {
            var eventMessageObject = this._eventMap[name]
            if (!eventMessageObject) {
                return false;
            }

            for (var key in eventMessageObject) {
                var eventViewObject = eventMessageObject[key];
                if (!eventViewObject) {
                    continue;
                }

                eventViewObject.eventMessage(name, data);
            }
        },

        register: function (name, view) {
            if (this._viewMap[name]) {
                return false;
            }

            this._viewMap[name] = view;

            for (var key in view.messageHandlerMap) {
                var eventMessageObject = this._eventMap[key];
                if (!eventMessageObject) {
                    eventMessageObject = {};
                }

                eventMessageObject[name] = view;
            }
            return true;
        },
        
        unRegister: function (name) {
            var view = this._viewMap[name];
            if (!view) {
                return;
            }

            for (var key in view.messageHandlerMap) {
                this._eventMap[key][name] = null;
            }

            this._viewMap[name] = null;
            return true;
        }
    });
})();