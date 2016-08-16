(function () {
    var FIND_NODE_MID_SIGN = ',';

    river.View = cc.Class.extend({
        _name: 'river.view',
        _touchHandlerMap: null,
        _messageHandlerMap: null,
        _res: null,
        _node: null,
        _isShowing: null,

        ctor: function () {
            this._touchHandlerMap = {};
            this._messageHandlerMap = {};
            this._isShowing = false;
        },
        
        getName: function () {
            return this._name;
        },

        getRes: function () {
            return this._res;
        },

        getChild: function (name, parent) {
            if (!this._node) {
                return;
            }

            var returnValue = null;
            var findNode = parent || this._node;
            var nodeNameList = name.split(FIND_NODE_MID_SIGN);
            while (nodeNameList.length > 0) {
                var childName = nodeNameList.shift();
                returnValue = findNode.getChildByName(childName);
                if (!returnValue) {
                    return null;
                }
            }

            return returnValue;
        },

        addTouch: function (name, endTouchCallBack, beginTouchCallBack, moveTouchCallBack) {
            var touchNode = this.getChild(name);
            if (!touchNode) {
                return false;
            }

            this._touchHandlerMap[name] = {
                endTouchCallBack: endTouchCallBack,
                beginTouchCallBack: beginTouchCallBack,
                moveTouchCallBack: moveTouchCallBack
            };

            touchNode.riverName = name;
            touchNode.addTouchEventListener(this.onAllTouch_RiverIn, this);
        },
        
        addHandler: function (name, callBack) {
            var messageObject = this._messageHandlerMap[name];
            if (!messageObject) {
                messageObject = [callBack];
            }

            messageObject.push(callBack);
        },

        eventMessage: function (name, data) {
            if (!this._isShowing) {
                return;
            }

            var messageList = this._messageHandlerMap[name];
            if (!messageList) {
                return;
            }

            for (var i = 0; i < messageList.length; i++) {
                var messageObject = messageList[i];
                if (!messageObject) {
                    continue;
                }

                messageObject.apply(this, data);
            }
        },
        
        onAllTouch_RiverIn: function (target, typeEnum) {
            var touchNode = this._touchHandlerMap[target.riverName];
            if (!touchNode) {
                return;
            }

            if (typeEnum === ccui.Widget.TOUCH_BEGAN) {
                if (touchNode.beginTouchCallBack) {
                    touchNode.beginTouchCallBack();
                }
            } else if (typeEnum === ccui.Widget.TOUCH_MOVED) {
                if (touchNode.moveTouchCallBack) {
                    touchNode.moveTouchCallBack();
                }
            } else if (typeEnum === ccui.Widget.TOUCH_ENDED) {
                if (touchNode.endTouchCallBack) {
                    touchNode.endTouchCallBack();
                }
            }
        }
    });

    river.View.prototype._defineGetter('messageHandlerMap', function () {
        return this._messageHandlerMap;
    });
})();