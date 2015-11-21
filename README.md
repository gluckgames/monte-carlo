# Monte Carlo simulator for real money games

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

```

Result:
```
==== 10 questions ====
N = 10000
speed: 25773games/sec, total 0.388sec

== Skill Level: 100% ==

wins: 5980 (59.80%) - 1 in 1.67
payout: £59.80 per game, £100.00 per won game (5980 won games), total of £598000.00

== Skill Level: 75% ==

wins: 337 (3.37%) - 1 in 29.67
payout: £3.37 per game, £100.00 per won game (337 won games), total of £33700.00

== Skill Level: 50% ==

wins: 6 (0.06%) - 1 in 1666.67
payout: £0.06 per game, £100.00 per won game (6 won games), total of £600.00


==== 8 questions ====
N = 10000
speed: 34965games/sec, total 0.286sec

== Skill Level: 100% ==

wins: 6629 (66.29%) - 1 in 1.51
payout: £33.15 per game, £50.00 per won game (6629 won games), total of £331450.00

== Skill Level: 75% ==

wins: 681 (6.81%) - 1 in 14.68
payout: £3.40 per game, £50.00 per won game (681 won games), total of £34050.00

== Skill Level: 50% ==

wins: 29 (0.29%) - 1 in 344.83
payout: £0.14 per game, £50.00 per won game (29 won games), total of £1450.00
```

In other words: The game tested isn't a great real money game.
