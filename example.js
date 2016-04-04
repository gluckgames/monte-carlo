#!/usr/bin/env node
"use strict";

let MonteCarlo = require("./index.js"); // Use "monte-carlo" outside this repo
let _ = require("underscore");

class ImpossibleQuizSimulator extends MonteCarlo.Simulator {
    before(results) {
        results.add("wins", new MonteCarlo.Results.Counter());
        results.add("payout", new MonteCarlo.Results.PayoutStandardDeviationCounter());
    }

    createGameState(rules) {
        let questions = _.map(_.range(rules.questions), () => {
            return {possible: this.randomDouble() > rules.chanceOfImpossibleQuestion};
        });

        return {
            questions: questions
        }
    }

    game(rules, gameState, results, skillOutcome) {
        let lost = false;

        while (!lost && gameState.questions.length) {
            let question = gameState.questions.pop();
            if (!question.possible || !skillOutcome()) {
                lost = true;
            }
        }

        if (!lost) {
            if (rules.amountsToBeWon) {
                results.payout.increase(this.shuffle(rules.amountsToBeWon)[0]);
            } else {
                results.payout.increase(this.random(rules.amountToBeWonMin, rules.amountToBeWonMax));
            }
            results.wins.increase();
        }
    }
}

let simulator = new ImpossibleQuizSimulator({ N: 10000 });

simulator.run("10 questions", {
    chanceOfImpossibleQuestion: 0.05,
    questions: 10,
    amountToBeWonMin: 50,
    amountToBeWonMax: 100
});

simulator.run("8 questions", {
    chanceOfImpossibleQuestion: 0.05,
    questions: 8,
    amountToBeWonMin: 25,
    amountToBeWonMax: 50
});

simulator.run("8 questions, fixed amounts", {
    chanceOfImpossibleQuestion: 0.05,
    questions: 8,
    amountsToBeWon: [1, 10, 25, 50, 100]
});
