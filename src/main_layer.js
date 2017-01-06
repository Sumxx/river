(function () {
    var mainLayer = river.View.extend({
        ctor: function () {
            this._super();
        },
        
        onShow: function () {
            this.createViewNode(res.mainLayer);
            river.container.addWindow(this.node);

            this._register();
        },
        
        onHide: function () {
            
        },

        _register: function () {
            this.addTouchMistiness("Button_2", function (target) {
                cc.log(1);
                target.setVisible(false);
            });

            this.addTouch("root.Button_1", function (target) {
                cc.log(2);
                river.viewMgr.show("test2Layer");
            })
        }
    });

    river.viewMgr.register("mainLayer", new mainLayer());
})();