(function () {
    var FIND_NODE_MID_SIGN = ',';

    river.View = cc.Class.extend({
        _name: 'river.view',
        _touchHandlerMap: null,
        _messageHandlerMap: null,
        _res: null,
        _node: null,
        _isShowing: null,
        _isPause: null,
        _isReady: null,
        _isLoadRes: null,
        _param: null,
        _parentNode: null,
        _parentNodeZOlder: null,

        ctor: function () {
            this._touchHandlerMap = {};
            this._messageHandlerMap = {};
            this._isShowing = false;
            this._isPause = false;
            this._isReady = false;
            this._isLoadRes = false;
            this._param = [];
            this._res = [];
        },

        show: function () {
            if (this._isPause) {
                return;
            }

            if (this._isLoadRes) {
                return;
            }

            if (!this._res) {
                return;
            }

            var needCache = [];
            for (var index = 0; index < this._res.length; index++) {
                var path = this._res[index];
                if (!path) {
                    continue;
                }

                if (cc.loader.cache[path]) {
                    continue;
                }

                needCache.push(path);
            }

            if (needCache.length === 0) {
                this.onReadyLoadRes_RiverIn();
            } else {
                this._isLoadRes = true;
                cc.loader.load(needCache, this.onReadyLoadRes_RiverIn.bind(this));
            }
        },
        
        createViewNode: function (filePath) {
            if (!filePath) {
                return false;
            }

            this._node = ccs.csLoader.createNode(filePath);
            return this._node ? true : false;
        },

        hide: function () {
            if (!this._isShowing) {
                return;
            }

            if (!this._node) {
                return;
            }

            this._node.setVisible(false);
            this.scheduleOnce(this.onDestroy_RiverIn, 0);
        },

        pause: function () {
            if (!this._isShowing) {
                return;
            }

            if (!this._node) {
                return;
            }

            this._parentNode = this._node.getParent();
            this._parentNodeZOlder = this._node.getLocalZOrder();
            if (!this._parentNode) {
                return;
            }

            this.onPause();
            this._isPause = true;
            this._node.retain();
            this._node.removeFromParent();
            river.ViewMgr.eventMessage(this._name + '.pause', this._node);
        },

        resume: function () {
            if (this._isShowing) {
                return;
            }

            if (!this._parentNode || !this._node) {
                return;
            }

            this.onResume();
            this._isPause = false;
            this._node.release();
            this._parentNode.addChild(this._node, this._parentNodeZOlder);
            this._parentNode = null;
            this._parentNodeZOlder = null;
        },

        setParam: function (param) {
            this._param = param;
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

        emit: function (name, data) {
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
        },
        
        onReadyLoadRes_RiverIn: function () {
            this._isLoadRes = false;
            this._isReady = true;
            this._isShowing = true;
            if (this._param && this._param.length > 0) {
                this.onShow.apply(this, this._param);
            } else {
                this.onShow();
            }
        },

        onDestroy_RiverIn: function () {
            this._isReady = false;
            this._isShowing = false;
            this._isReady = false;
            if (!this._node) {
                return;
            }

            this.onHide();
            this._node.removeFromParent();
            this._node = null;
        },

        onShow: function () {
            
        },
        
        onHide: function () {
            
        },
        
        onPause: function () {

        },
        
        onResume: function () {

        }
    });

    river.View.prototype.__defineGetter__('messageHandlerMap', function () {
        return this._messageHandlerMap;
    });
    
    river.View.prototype.__defineGetter__('isShowing', function () {
        return this._isShowing;
    });

    river.View.prototype.__defineGetter__('isPause', function () {
        return this._isPause;
    });

    river.View.prototype.__defineGetter__('isReady', function () {
        return this._isReady;
    });

    river.View.prototype.__defineGetter__('node', function () {
        return this._node;
    });
})();