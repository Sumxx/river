(function () {
    var Container = cc.Scene.extend({
        _sceneLayer: null,
        _viewLayer: null,
        _uiLayer: null,
        _popLayer: null,

        _sceneIndexZOlder: null,
        _viewIndexZOlder: null,
        _uiIndexZOlder: null,
        _popIndexZOlder: null,

        ctor: function () {
            this._super();
            this._sceneLayer = new cc.Node();
            this._viewLayer = new cc.Node();
            this._uiLayer = new cc.Node();
            this._popLayer = new cc.Node();
            this._sceneIndexZOlder = 0;
            this._viewIndexZOlder = 0;
            this._uiIndexZOlder = 0;
            this._popIndexZOlder = 0;
        },

        onEnter: function () {
            this._super();
            this.addChild(this._sceneLayer, 0);
            this.addChild(this._viewLayer, 1);
            this.addChild(this._uiLayer, 2);
            this.addChild(this._popLayer, 3);
        },

        addWindow: function (node) {
            this._viewLayer.addChild(node, this._viewIndexZOlder++);
        },

        removeWindow: function (node) {
            this._viewLayer.removeChild(node);
        },

        addPop: function (node) {
            this._popLayer.addChild(node, this._popIndexZOlder++);
        },

        removePop: function (node) {
            this._popLayer.removeChild(node);
        },

        addUI: function (node) {
            this._uiLayer.addChild(node, this._uiIndexZOlder++);
        },

        removeUI: function (node) {
            this._uiLayer.removeChild(node);
        },

        addScene: function (node) {
            this._sceneLayer.addChild(node, this._sceneIndexZOlder++);
        },

        removeScene: function (node) {
            this._sceneLayer.removeChild(node);
        }
    });

    river.container = new Container();
})();