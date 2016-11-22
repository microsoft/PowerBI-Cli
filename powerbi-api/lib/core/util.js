"use strict";
var Util = (function () {
    function Util() {
    }
    Util.getUnixTime = function (date) {
        return Math.floor(date.getTime() / 1000);
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=util.js.map