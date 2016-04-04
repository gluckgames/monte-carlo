"use strict";

let MonteCarlo = require("../index");
let _ = require("underscore");
let expect = require("chai").expect;

class TestSimulator extends MonteCarlo.Simulator {
    before(results) {
        results.add("wins", new MonteCarlo.Results.Counter());
        results.add("payout", new MonteCarlo.Results.PayoutCounter());
        results.add("payoutStDev", new MonteCarlo.Results.PayoutStandardDeviationCounter());
    }

    createGameState(rules) {
        let questions = _.map(_.range(rules.questions), function() {
            return {possible: Math.random() > rules.chanceOfImpossibleQuestion};
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
            results.payout.increase(rules.amountToBeWon);
            results.payoutStDev.increase(rules.amountToBeWon);
            results.wins.increase();
        }
    }
}

describe("Smoke test", () => {
    it("does a normal run with slow clone", () => {
        let simulator = new TestSimulator({ N: 10000, slowClone: true });

        simulator.run("10 questions", {
            chanceOfImpossibleQuestion: 0.05,
            questions: 10,
            amountToBeWon: 100
        });

    });

    it("does a normal run without slow clone", () => {
        let simulator = new TestSimulator({ N: 10000, slowClone: false });

        simulator.run("10 questions", {
            chanceOfImpossibleQuestion: 0.05,
            questions: 10,
            amountToBeWon: 100
        });
    });

    it("does a normal run without percent skill level", () => {
        let simulator = new TestSimulator({ N: 1, skillLevelInPercents: false });

        simulator.game = (rules, gameState, results, skill) => {
            expect(typeof skill).to.equal("number");
        }

        simulator.run("10 questions", {});
    });
});
