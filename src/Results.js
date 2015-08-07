"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var Results = (function () {
    function Results() {
        _classCallCheck(this, Results);

        this.orderOfNames = [];
    }

    _createClass(Results, [{
        key: "add",
        value: function add(name, resultModule) {
            this[name] = resultModule;
            this.orderOfNames.push(name);
            return this;
        }
    }, {
        key: "format",
        value: function format(N) {
            var _this = this;

            return _underscore2["default"].flatten(this.orderOfNames.map(function (name) {
                var output = _this[name].format(N);
                if (_underscore2["default"].isArray(output)) {
                    output = output.map(function (line) {
                        return "  " + line;
                    });
                    output.unshift(name + ":");
                    return output;
                } else {
                    return [name + ": " + output.toString()];
                }
            }));
        }
    }]);

    return Results;
})();

exports["default"] = Results;
module.exports = exports["default"];