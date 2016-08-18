(function () {
    river.util = {};

    river.util.callFunc = function (cb) {
        if (!cb) {
            return;
        }

        if (typeof(cb) !== 'function') {
            return;
        }

        if (arguments.length > 1) {
            cb.apply(null, Array.prototype.slice.call(arguments, 1));
        } else {
            cb.call(null);
        }
    }
})();