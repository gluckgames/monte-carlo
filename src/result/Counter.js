'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _GenericJs = require('./Generic.js');

var _GenericJs2 = _interopRequireDefault(_GenericJs);

var Counter = (function (_GenericResult) {
    _inherits(Counter, _GenericResult);

    function Counter() {
        var formatter = arguments.length <= 0 || arguments[0] === undefined ? new Counter.OutcomeFormatter() : arguments[0];

        _classCallCheck(this, Counter);

        _get(Object.getPrototypeOf(Counter.prototype), 'constructor', this).call(this, formatter);
        this.n = 0;
    }

    _createClass(Counter, [{
        key: 'increase',
        value: function increase() {
            var by = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

            this.n += by;
        }
    }, {
        key: 'format',
        value: function format(N) {
            return this.formatter.format(this.n, N);
        }
    }]);

    return Counter;
})(_GenericJs2['default']);

exports['default'] = Counter;
;

Counter.OutcomeFormatter = (function (_GenericResult$GenericFormatter) {
    _inherits(_class, _GenericResult$GenericFormatter);

    function _class() {
        _classCallCheck(this, _class);

        _get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(_class, [{
        key: 'format',
        value: function format(n, N) {
            return n + ' (' + this.formatPercent(n, N) + ') - ' + this.formatOneIn(n, N);
        }
    }]);

    return _class;
})(_GenericJs2['default'].GenericFormatter);

Counter.EventFormatter = (function (_GenericResult$GenericFormatter2) {
    _inherits(_class2, _GenericResult$GenericFormatter2);

    function _class2() {
        _classCallCheck(this, _class2);

        _get(Object.getPrototypeOf(_class2.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(_class2, [{
        key: 'format',
        value: function format(n, N) {
            return (n / N).toFixed(2) + ' per game';
        }
    }]);

    return _class2;
})(_GenericJs2['default'].GenericFormatter);
module.exports = exports['default'];