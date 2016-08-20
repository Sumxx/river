(function () {
    river.util = {};

    river.util.callFunc = function (cb, oc) {
        if (!cb) {
            return;
        }

        if (typeof(cb) !== 'function') {
            return;
        }

        if (arguments.length > 1) {
            cb.apply(oc, Array.prototype.slice.call(arguments, 2));
        } else {
            cb.call(oc);
        }
    }
})();