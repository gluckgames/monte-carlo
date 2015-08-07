"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Simulator = require("./Simulator");

var _Simulator2 = _interopRequireDefault(_Simulator);

var _resultGeneric = require("./result/Generic");

var _resultGeneric2 = _interopRequireDefault(_resultGeneric);

var _resultCounter = require("./result/Counter");

var _resultCounter2 = _interopRequireDefault(_resultCounter);

var _resultPayoutCounter = require("./result/PayoutCounter");

var _resultPayoutCounter2 = _interopRequireDefault(_resultPayoutCounter);

var _resultMapCounter = require("./result/MapCounter");

var _resultMapCounter2 = _interopRequireDefault(_resultMapCounter);

var _resultMapPayoutCounter = require("./result/MapPayoutCounter");

var _resultMapPayoutCounter2 = _interopRequireDefault(_resultMapPayoutCounter);

exports["default"] = {
    Simulator: _Simulator2["default"],
    Results: {
        Generic: _resultGeneric2["default"],
        Counter: _resultCounter2["default"],
        PayoutCounter: _resultPayoutCounter2["default"],
        MapCounter: _resultMapCounter2["default"],
        MapPayoutCounter: _resultMapPayoutCounter2["default"]
    }
};
module.exports = exports["default"];