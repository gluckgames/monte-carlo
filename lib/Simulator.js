"use strict";

let Results = require("./Results");
let MersenneTwister = require("mersenne-twister");

/*eslint-disable no-console */
module.exports = class Simulator {
    constructor(options) {
        this.twister = new MersenneTwister();
        this._setOptions(options);

        // progress bar settings
        this.enableProgess = (options.enableProgess === undefined) ? Boolean(process.stdin.isTTY) : options.enableProgess;
        this.progressBarWidth = options.progressBarWidth || 10;

        // set to true if your cloneGameState() function is slower than your createGameState()
        this.slowClone = (options.slowClone === undefined) ? false : options.slowClone;
        if (this.skillLevels.length === 1) {
            this.slowClone = true;
        }
    }

    _setOptions(options) {
        options = options || {};
        this.skillLevels = options.skillLevels || [1, 0.75, 0.5];
        this.skillLevelInPercents = (options.skillLevelInPercents === undefined) ? true : options.skillLevelInPercents;
        this.N = options.N || 10000;
    }

    setN(N) {
        this.N = N;
        return this;
    }

    benchmark(rules) {
        let repetitions = 10000;
        console.log("=== Benchmark ===");
        console.log();

        let startTimeCreateGameState = Date.now();
        let someGameState = null;
        for (let i=0; i<repetitions; i++) {
            someGameState = this.createGameState(rules);
        }
        let durationCreateGameState = Date.now() - startTimeCreateGameState;
        console.log(`createGameState      : ${durationCreateGameState / repetitions}ms/game`);

        let startTimeCloneGameState = Date.now();
        for (let i=0; i<repetitions; i++) {
            this.cloneGameState(someGameState);
        }
        let durationCloneGameState = Date.now() - startTimeCloneGameState;
        console.log(`cloneGameState       : ${durationCloneGameState  / repetitions}ms/game`);

        let startGame = Date.now();
        let someResults = new Results();
        this.before(someResults, rules);
        for (let i=0; i<repetitions; i++) {
            this.game(rules, this.cloneGameState(someGameState), someResults, () => Math.random() < 0.5 );
        }
        let durationGame = Date.now() - startGame;
        console.log(`game + cloneGameState: ${durationGame            / repetitions}ms/game`);
        console.log(`game                 : ${(durationGame - durationCloneGameState) / repetitions}ms/game`);
    }

    _warnAboutMissingOverrides() {
        if (!this.createGameState) { console.error("Please implement createGameState()"); }
        if (!this.game) { console.error("Please implement game(rules, gameState, results, skillOutcome)"); }
        if (!this.before) { console.error("Please implement before(results, rules)"); }
    }

    _createSkillOutcomesObject(results, rules) {
        let skillOutcomes = {};

        this.skillLevels.forEach((skillLevel, index) => {
            this.before(results[index], rules);

            if (this.skillLevelInPercents) {
                skillOutcomes[index] = () => {
                    if (skillLevel === 1) {
                        return true;
                    }
                    return Math.random() < skillLevel;
                };
            } else {
                skillOutcomes[index] = skillLevel;
            }
        });

        return skillOutcomes;
    }

    _printOutcome(name, startTime, results) {
        if (name) {
            console.log(`==== ${name} ====`);
        }
        console.log(`N = ${this.N}`);

        let endTime = new Date().getTime();
        let duration = (endTime - startTime) / 1000;
        console.log(`speed: ${Math.round(this.N / duration)}games/sec, total ${duration}sec`);
        console.log();

        this.skillLevels.forEach((skillLevel, index) => {
            if (this.skillLevels.length > 1) {
                if (this.skillLevelInPercents) {
                    console.log(`== Skill Level: ${Math.round(skillLevel * 100)}% ==`);
                } else {
                    console.log(`== Skill Level: ${skillLevel} ==`);
                }
                console.log();
            }

            console.log(results[index].format(this.N).join("\n"));
            console.log();
        });
    }

    _calculateResultSlowClone(results, rules, skillOutcomes) {
        let progressPoint = Math.floor(this.N / this.progressBarWidth);

        for (let j=0; j<this.skillLevels.length; j++) {
            for (let i=0; i<this.N; i++) {
                this.game(rules, this.createGameState(rules), results[j], skillOutcomes[j]);

                if (this.enableProgess && (i + j * this.N) % (progressPoint * this.skillLevels.length) === 0) {
                    this.progressStep(i + j * this.N, this.N * this.skillLevels.length);
                }
            }
        }
    }

    _calculateResult(results, rules, skillOutcomes) {
        let progressPoint = Math.floor(this.N / this.progressBarWidth);

        for (let i=0; i<this.N; i++) {
            let gameState = this.createGameState(rules);
            for (let j=0; j<this.skillLevels.length; j++) {
                this.game(rules, this.cloneGameState(gameState), results[j], skillOutcomes[j]);
            }

            if (this.enableProgess && i % progressPoint === 0) {
                this.progressStep(i, this.N);
            }
        }
    }

    run(name, rules) {
        let startTime = new Date().getTime();

        this._warnAboutMissingOverrides();

        let results = this.skillLevels.map(() => new Results());
        let skillOutcomes = this._createSkillOutcomesObject(results, rules);

        if (this.slowClone) {
            this._calculateResultSlowClone(results, rules, skillOutcomes);
        } else {
            this._calculateResult(results, rules, skillOutcomes);
        }

        if (this.enableProgess) {
            this.clearProgress();
        }

        this._printOutcome(name, startTime, results);
    }

    // override this for a more efficent clone
    cloneGameState(gameState) {
        return JSON.parse(JSON.stringify(gameState));
    }

    /* Progress bar */
    progressStep(n, N) {
        let current = Math.ceil(n / N * this.progressBarWidth);
        process.stderr.cursorTo(0);
        process.stderr.write("[");
        for (let i=0; i<this.progressBarWidth; i++) {
            process.stderr.write((i<current) ? "#": " ");
        }
        process.stderr.write("]");
    }

    clearProgress() {
        process.stderr.clearLine();
        process.stderr.write("\n");
    }

    /**
     * Convenient random functions
     **/

    shuffle(set) {
        var length = set.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand = this.random(0, index);
            if (rand !== index) shuffled[index] = shuffled[rand];
            shuffled[rand] = set[index];
        }
        return shuffled;
    }

    random(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(this.twister.random() * (max - min + 1));
    }

    randomDouble() {
        return this.twister.random();
    }
}
/*eslint-enable no-console */
