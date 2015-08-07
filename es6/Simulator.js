
import _ from 'underscore';
import ProgressBar from 'progress';
import Results from './Results';

export default class Simulator {
    constructor(options = {}) {
        this.skillLevels = options.skillLevels || [1, 0.75, 0.5];
        this.skillLevelInPercents = (options.skillLevelInPercents === undefined) ? true : options.skillLevelInPercents;
        this.N = options.N || 10000;

        // progress bar settings
        this.enableProgess = (options.enableProgess === undefined) ? Boolean(process.stdin.isTTY) : options.enableProgess;
        this.progressBarWidth = options.progressBarWidth || 10;

        // set to true if your cloneGameState() function is slower than your createGameState()
        this.slowClone = (options.slowClone === undefined) ? false : options.slowClone;
        if (this.skillLevels.length === 1) {
            this.slowClone = true;
        }
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

    run(name, rules) {
        let startTime = new Date().getTime();
        let progressPoint = Math.floor(this.N / this.progressBarWidth);

        if (!this.createGameState) { console.error('Please implement createGameState()'); }
        if (!this.game) { console.error('Please implement game(rules, gameState, results, skillOutcome)'); }
        if (!this.before) { console.error('Please implement before(results, rules)'); }

        let results = {};
        let skillOutcomes = {};

        this.skillLevels.forEach((skillLevel, index) => {
            results[index] = new Results();
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


        let skillLevelCount = this.skillLevels.length;
        if (this.slowClone) {
            for (let j=0; j<skillLevelCount; j++) {
                for (let i=0; i<this.N; i++) {
                    this.game(rules, this.createGameState(rules), results[j], skillOutcomes[j]);

                    if (this.enableProgess && (i + j * this.N) % (progressPoint * skillLevelCount) === 0) {
                        this.progressStep(i + j * this.N, this.N * skillLevelCount);
                    }
                }
            }
        } else {
            for (let i=0; i<this.N; i++) {
                let gameState = this.createGameState(rules);
                for (let j=0; j<skillLevelCount; j++) {
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

    // override this for a more efficent clone
    cloneGameState(gameState) {
        return JSON.parse(JSON.stringify(gameState));
    }

    /* Progress bar */
    progressStep(n, N) {
        let current = Math.ceil(n / N * this.progressBarWidth);
        process.stderr.cursorTo(0);
        process.stderr.write('[');
        for (let i=0; i<this.progressBarWidth; i++) {
            process.stderr.write((i<current) ? '#': ' ');
        }
        process.stderr.write(']');
    }

    clearProgress() {
        process.stderr.clearLine();
        process.stderr.write("\n");
    }
}
