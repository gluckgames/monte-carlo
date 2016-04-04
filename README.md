# Monte Carlo simulator for real money games

[![Build Status](https://travis-ci.org/Gamevy/monte-carlo.svg?branch=master)](https://travis-ci.org/Gamevy/monte-carlo)
[![Dependency Status](https://david-dm.org/Gamevy/monte-carlo.svg)](https://david-dm.org/marekventur/dependency-updater)
[![devDependency Status](https://david-dm.org/Gamevy/monte-carlo/dev-status.svg)](https://david-dm.org/marekventur/dependency-updater#info=devDependencies)

This is a oppinonated framework for calculating chances of outcomes for games based on a simulation. This can be used to model rules and paytables a test them for win rates and average player return.

It's especially useful for games that combine chance elements with skill (like quizzes) and real money gambling and have rules that make it hard to work out the results mathematically.

Uses ES6 and is therefore Node >4.0.0 only.

## Features

* Optimised for speed
* Simulates different skill levels (By default 50%, 75% and 100% correct)
* Build-in support for collections and presenting results
* Progress indicator

## Example

What's the chance of answering N questions correctly in a row if there's a 5% chance of hitting a question that's impossible to answer?

```javascript
#!/usr/bin/env node

import MonteCarlo from "monte-carlo";
import _ from "underscore";

class ImpossibleQuizSimulator extends MonteCarlo.Simulator {
    before(results, rules) {
        results.add("wins", new MonteCarlo.Results.Counter());
        results.add("payout", new MonteCarlo.Results.PayoutStandardDeviationCounter());
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

```

Result:
```
==== 10 questions ====
N = 10000
speed: 13850games/sec, total 0.722sec

== Skill Level: 100% ==

wins: 6078 (60.78%) - 1 in 1.65
payout: £60.78 per game, £100.00 per won game (6078 won games), total of £607800.00 (STDDEV: £42.95)

== Skill Level: 75% ==

wins: 344 (3.44%) - 1 in 29.07
payout: £3.44 per game, £100.00 per won game (344 won games), total of £34400.00 (STDDEV: £24.92)

== Skill Level: 50% ==

wins: 4 (0.04%) - 1 in 2500.00
payout: £0.04 per game, £100.00 per won game (4 won games), total of £400.00 (STDDEV: £2.83)


==== 8 questions ====
N = 10000
speed: 13550games/sec, total 0.738sec

== Skill Level: 100% ==

wins: 6604 (66.04%) - 1 in 1.51
payout: £33.02 per game, £50.00 per won game (6604 won games), total of £330200.00 (STDDEV: £20.17)

== Skill Level: 75% ==

wins: 655 (6.55%) - 1 in 15.27
payout: £3.27 per game, £50.00 per won game (655 won games), total of £32750.00 (STDDEV: £16.42)

== Skill Level: 50% ==

wins: 25 (0.25%) - 1 in 400.00
payout: £0.13 per game, £50.00 per won game (25 won games), total of £1250.00 (STDDEV: £3.52)
```

In other words: The game tested isn't a great real money game.
