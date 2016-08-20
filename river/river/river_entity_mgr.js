(function () {
    var EntityMgr = cc.Class.extend({
        _entityList: null,

        ctor: function () {
            this._entityList = {};
        },
        
        addEntity: function (name, entity) {
            this._entityList[name] = entity;
        },
        
        removeEntity: function (name) {
            this._entityList[name] = null;
        },

        emit: function (event) {
            for (var key in this._entityList) {
                var entity = this._entityList[key];
                if (entity) {
                    river.util.callFunc(entity.sendCall, event, arguments);
                }
            }
        }
    });

    river.entityMgr = new EntityMgr();
})();