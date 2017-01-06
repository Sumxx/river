(function () {
    var test2Layer = river.View.extend({
        ctor: function () {
            this._super();
        },

        onShow: function () {
            this.createViewNode(res.test2layer);
            river.container.addWindow(this.node);

            this._register();
        },

        onHide: function () {

        },

        _register: function () {
            this.addTouchMistiness("Button_1", function (target) {
                this.hide();
            });
        }
    });

    river.viewMgr.register("test2Layer", new test2Layer());
})();