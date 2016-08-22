(function () {
    var mainLayer = river.View.extend({
        ctor: function () {
            this._super();
        },
        
        onShow: function () {
            this.createViewNode(res.mainLayer);
            river.container.addWindow(this.node);
        },
        
        onHide: function () {
            
        }
    });

    river.viewMgr.register("mainLayer", new mainLayer());
})();