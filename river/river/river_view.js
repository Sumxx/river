(function () {
    var FIND_NODE_MID_SIGN = '.';

    // view globe setting
    river.View.GlobeConfig = {
        touchDefaultBeginCB: function () {},
        touchDefaultEndCB: function () {},
        touchDefaultMoveCB: function () {},
        touchDefaultCancelCB: function () {}
    };

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

            // 因效率问题，暂时考虑放弃

            // if (this._isLoadRes) {
            //     return;
            // }

            // if (!this._res) {
            //     return;
            // }

            // var needCache = [];
            // for (var index = 0; index < this._res.length; index++) {
            //     var path = this._res[index];
            //     if (!path) {
            //         continue;
            //     }
            //
            //     if (cc.loader.cache[path]) {
            //         continue;
            //     }
            //
            //     needCache.push(path);
            // }
            //
            // if (needCache.length === 0) {
            //     this.onReadyLoadRes_RiverIn();
            // } else {
            //     this._isLoadRes = true;
            //     cc.loader.load(needCache, this.onReadyLoadRes_RiverIn.bind(this));
            // }
            this.onReadyLoadRes_RiverIn();
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
            this._node.scheduleOnce(this.onDestroy_RiverIn.bind(this), 0, this._name + "_onDestroy_RiverIn");
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

            river.viewMgr.emit(this._name + '.pause', this._node);
            this.onPause();
            this._isPause = true;
            this._node.retain();
            this._node.removeFromParent();
        },

        resume: function () {
            if (this._isShowing) {
                return;
            }

            if (!this._parentNode || !this._node) {
                return;
            }

            river.viewMgr.emit(this._name + '.resume', this._node);
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
            var returnValue = null;
            var findNode = parent || this._node;
            if (!findNode) {
                cc.warn("getChild node is null");
                return null;
            }

            var nodeNameList = name.split(FIND_NODE_MID_SIGN);
            while (nodeNameList.length > 0) {
                var childName = nodeNameList.shift();
                returnValue = findNode.getChildByName(childName);
                if (!returnValue) {
                    cc.warn("getChild not find by name :", childName);
                    return null;
                }
                findNode = returnValue;
            }

            return returnValue;
        },

        getChildMistiness: function (name, parent) {
            var findNode = parent || this._node;
            if (!findNode) {
                cc.warn("getChildMistiness node is null");
                return null;
            }

            return ccui.helper.seekWidgetByName(findNode, name);
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

        addTouchMistiness: function (name, endTouchCallBack, beginTouchCallBack, moveTouchCallBack) {
            var touchNode = this.getChildMistiness(name);
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
                    river.View.GlobeConfig.touchDefaultBeginCB.call(this, target);
                    touchNode.beginTouchCallBack.call(this, target);
                }
            } else if (typeEnum === ccui.Widget.TOUCH_MOVED) {
                if (touchNode.moveTouchCallBack) {
                    river.View.GlobeConfig.touchDefaultMoveCB.call(this, target);
                    touchNode.moveTouchCallBack.call(this, target);
                }
            } else if (typeEnum === ccui.Widget.TOUCH_ENDED) {
                if (touchNode.endTouchCallBack) {
                    river.View.GlobeConfig.touchDefaultEndCB.call(this, target);
                    touchNode.endTouchCallBack.call(this, target);
                }
            } else if (typeEnum === ccui.Widget.TOUCH_CANCELED) {
                if (touchNode.endTouchCallBack) {
                    river.View.GlobeConfig.touchDefaultCancelCB.call(this, target, true);
                    touchNode.endTouchCallBack.call(this, target, true);
                }
            }
        },
        
        onReadyLoadRes_RiverIn: function () {
            this._isLoadRes = false;
            this._isReady = true;
            this._isShowing = true;
            if (this._param && this._param.length > 0) {
                river.viewMgr.emit(this._name + '.show', this._node);
                this.onShow.apply(this, this._param);
            } else {
                river.viewMgr.emit(this._name + '.show', this._node);
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

            river.viewMgr.emit(this._name + '.hide', this._node);
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