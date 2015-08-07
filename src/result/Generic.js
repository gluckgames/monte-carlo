"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericResult = function GenericResult(formatter) {
    _classCallCheck(this, GenericResult);

    this.formatter = formatter;
};

exports["default"] = GenericResult;

GenericResult.GenericFormatter = (function () {
    function GenericFormatter() {
        _classCallCheck(this, GenericFormatter);
    }

    _createClass(GenericFormatter, [{
        key: "setAccuracy",
        value: function setAccuracy(digits) {
            this.settings.accuracyInDigits = digits;
            return this;
        }
    }, {
        key: "formatPercent",
        value: function formatPercent(n, N) {
            return (n / N * 100).toFixed(2) + "%";
        }
    }, {
        key: "formatOneIn",
        value: function formatOneIn(n, N) {
            return "1 in " + (N / n).toFixed(2);
        }
    }, {
        key: "formatMoney",
        value: function formatMoney(amount) {
            return "£" + amount.toFixed(2);
        }
    }]);

    return GenericFormatter;
})();
module.exports = exports["default"];