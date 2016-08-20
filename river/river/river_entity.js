(function () {
    river.Entity = cc.Class.extend({
        ctor: function () {
            
        },

        sendCall: function (name) {
            var selfFn = this[name];
            if (!selfFn) {
                return;
            }

            if (typeof(selfFn) !== 'function') {
                return;
            }

            selfFn.apply(this, Array.prototype.slice.call(arguments, 1));
        },
        
        send: function (name, data) {
            var params = Array.prototype.slice.call(arguments, 1);
            this.onUpdateProperty(name, data);
            river.viewMgr.emit(name, params);
        },
        
        onUpdateProperty: function (name, data) {
            
        }
    });
})();