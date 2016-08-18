(function () {
    river.ViewMgr = cc.Class.extend({
        _viewMap: null,
        _eventMap: null,

        ctor: function () {
            this._viewMap = {};
            this._eventMap = {};
        },

        eventMessage: function (name, data) {
            var eventMessageObject = this._eventMap[name];
            if (!eventMessageObject) {
                return;
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
        },

        show: function (name) {
            if (!name) {
                return;
            }

            var view = this._viewMap[name];
            if (!view) {
                return;
            }

            if (view.isShowing) {
                return;
            }

            view.setParam(arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : null);
            view.show();
        },
        
        hide: function (name) {
            if (!name) {
                return;
            }

            var view = this._viewMap[name];
            if (!view) {
                return;
            }


            if (!view.isShowing) {
                return;
            }

            view.hide();
        },
        
        pause: function (name) {
            if (!name) {
                return;
            }

            var view = this._viewMap[name];
            if (!view) {
                return;
            }


            if (!view.isShowing) {
                return;
            }

            view.pause();
        },
        
        resume: function (name) {
            if (!name) {
                return;
            }

            var view = this._viewMap[name];
            if (!view) {
                return;
            }


            if (view.isShowing) {
                return;
            }

            view.resume();
        },
        
        isShow: function (name) {
            if (!name) {
                return;
            }

            var view = this._viewMap[name];
            if (!view) {
                return;
            }

            return view.isShowing;
        },
        
        isPause: function (name) {
            if (!name) {
                return;
            }

            var view = this._viewMap[name];
            if (!view) {
                return;
            }

            return view.isShowing;
        },
        
        isReady: function (name) {
            if (!name) {
                return;
            }

            var view = this._viewMap[name];
            if (!view) {
                return;
            }

            return view.isShowing;
        }
    });
})();