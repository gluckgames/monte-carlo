#!/usr/bin/env babel-node

import MonteCarlo from "./index.js"; // Use "monte-carlo" outside this repo
import _ from "underscore";

class ImpossibleQuizSimulator extends MonteCarlo.Simulator {
    before(results, rules) {
        results.add("wins", new MonteCarlo.Results.Counter());
        results.add("payout", new MonteCarlo.Results.PayoutCounter());
    }

    createGameState(rules) {
        var questions = _.map(_.range(rules.questions), function() {
            return {possible: Math.random() > rules.chanceOfImpossibleQuestion};
        });

        return {
            questions: questions
        }
    }

    game(rules, gameState, results, skillOutcome) {
        var lost = false;

        while (!lost && gameState.questions.length) {
            var question = gameState.questions.pop();
            if (!question.possible || !skillOutcome()) {
                lost = true;
            }
        }

        if (!lost) {
            results.payout.increase(rules.amountToBeWon);
            results.wins.increase();
        }
    }
}

var simulator = new ImpossibleQuizSimulator({ N: 10000 });

simulator.run("10 questions", {
    chanceOfImpossibleQuestion: 0.05,
    questions: 10,
    amountToBeWon: 100
});

simulator.run("8 questions", {
    chanceOfImpossibleQuestion: 0.05,
    questions: 8,
    amountToBeWon: 50
});
