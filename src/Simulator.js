'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _Results = require('./Results');

var _Results2 = _interopRequireDefault(_Results);

var Simulator = (function () {
    function Simulator() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Simulator);

        this.skillLevels = options.skillLevels || [1, 0.75, 0.5];
        this.skillLevelInPercents = options.skillLevelInPercents === undefined ? true : options.skillLevelInPercents;
        this.N = options.N || 10000;

        // progress bar settings
        this.enableProgess = options.enableProgess === undefined ? Boolean(process.stdin.isTTY) : options.enableProgess;
        this.progressBarWidth = options.progressBarWidth || 10;

        // set to true if your cloneGameState() function is slower than your createGameState()
        this.slowClone = options.slowClone === undefined ? false : options.slowClone;
        if (this.skillLevels.length === 1) {
            this.slowClone = true;
        }
    }

    _createClass(Simulator, [{
        key: 'setN',
        value: function setN(N) {
            this.N = N;
            return this;
        }
    }, {
        key: 'benchmark',
        value: function benchmark(rules) {
            var repetitions = 10000;
            console.log("=== Benchmark ===");
            console.log();

            var startTimeCreateGameState = Date.now();
            var someGameState = null;
            for (var i = 0; i < repetitions; i++) {
                someGameState = this.createGameState(rules);
            }
            var durationCreateGameState = Date.now() - startTimeCreateGameState;
            console.log('createGameState      : ' + durationCreateGameState / repetitions + 'ms/game');

            var startTimeCloneGameState = Date.now();
            for (var i = 0; i < repetitions; i++) {
                this.cloneGameState(someGameState);
            }
            var durationCloneGameState = Date.now() - startTimeCloneGameState;
            console.log('cloneGameState       : ' + durationCloneGameState / repetitions + 'ms/game');

            var startGame = Date.now();
            var someResults = new _Results2['default']();
            this.before(someResults, rules);
            for (var i = 0; i < repetitions; i++) {
                this.game(rules, this.cloneGameState(someGameState), someResults, function () {
                    return Math.random() < 0.5;
                });
            }
            var durationGame = Date.now() - startGame;
            console.log('game + cloneGameState: ' + durationGame / repetitions + 'ms/game');
            console.log('game                 : ' + (durationGame - durationCloneGameState) / repetitions + 'ms/game');
        }
    }, {
        key: 'run',
        value: function run(name, rules) {
            var _this = this;

            var startTime = new Date().getTime();
            var progressPoint = Math.floor(this.N / this.progressBarWidth);

            if (!this.createGameState) {
                console.error('Please implement createGameState()');
            }
            if (!this.game) {
                console.error('Please implement game(rules, gameState, results, skillOutcome)');
            }
            if (!this.before) {
                console.error('Please implement before(results, rules)');
            }

            var results = {};
            var skillOutcomes = {};

            this.skillLevels.forEach(function (skillLevel, index) {
                results[index] = new _Results2['default']();
                _this.before(results[index], rules);

                if (_this.skillLevelInPercents) {
                    skillOutcomes[index] = function () {
                        if (skillLevel === 1) {
                            return true;
                        }
                        return Math.random() < skillLevel;
                    };
                } else {
                    skillOutcomes[index] = skillLevel;
                }
            });

            var skillLevelCount = this.skillLevels.length;
            if (this.slowClone) {
                for (var j = 0; j < skillLevelCount; j++) {
                    for (var i = 0; i < this.N; i++) {
                        this.game(rules, this.createGameState(rules), results[j], skillOutcomes[j]);

                        if (this.enableProgess && (i + j * this.N) % (progressPoint * skillLevelCount) === 0) {
                            this.progressStep(i + j * this.N, this.N * skillLevelCount);
                        }
                    }
                }
            } else {
                for (var i = 0; i < this.N; i++) {
                    var gameState = this.createGameState(rules);
                    for (var j = 0; j < skillLevelCount; j++) {
                        this.game(rules, this.cloneGameState(gameState), results[j], skillOutcomes[j]);
                    }

                    if (this.enableProgess && i % progressPoint === 0) {
                        this.progressStep(i, this.N);
                    }
                }
            }

            if (this.enableProgess) {
                this.clearProgress();
            }

            if (name) {
                console.log('==== ' + name + ' ====');
            }
            console.log('N = ' + this.N);

            var endTime = new Date().getTime();
            var duration = (endTime - startTime) / 1000;
            console.log('speed: ' + Math.round(this.N / duration) + 'games/sec, total ' + duration + 'sec');
            console.log();

            this.skillLevels.forEach(function (skillLevel, index) {
                if (_this.skillLevels.length > 1) {
                    if (_this.skillLevelInPercents) {
                        console.log('== Skill Level: ' + Math.round(skillLevel * 100) + '% ==');
                    } else {
                        console.log('== Skill Level: ' + skillLevel + ' ==');
                    }
                    console.log();
                }

                console.log(results[index].format(_this.N).join("\n"));
                console.log();
            });
        }

        // override this for a more efficent clone
    }, {
        key: 'cloneGameState',
        value: function cloneGameState(gameState) {
            return JSON.parse(JSON.stringify(gameState));
        }

        /* Progress bar */
    }, {
        key: 'progressStep',
        value: function progressStep(n, N) {
            var current = Math.ceil(n / N * this.progressBarWidth);
            process.stderr.cursorTo(0);
            process.stderr.write('[');
            for (var i = 0; i < this.progressBarWidth; i++) {
                process.stderr.write(i < current ? '#' : ' ');
            }
            process.stderr.write(']');
        }
    }, {
        key: 'clearProgress',
        value: function clearProgress() {
            process.stderr.clearLine();
            process.stderr.write("\n");
        }
    }]);

    return Simulator;
})();

exports['default'] = Simulator;
module.exports = exports['default'];