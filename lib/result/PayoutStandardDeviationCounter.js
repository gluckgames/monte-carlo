"use strict";

let GenericResult = require("./Generic.js");
let Counter = require("./Counter.js");
let stats = require("stats-lite");

class PayoutStandardDeviationCounter extends Counter {
    constructor(formatter) {
        formatter = formatter || new PayoutStandardDeviationCounter.DefaultFormatter();

        super(formatter);
        this.payouts = [];
    }

    increase(by) {
        this.payouts.push(by);
    }

    format(N) {
        let n = this.payouts.length;
        let amount = stats.sum(this.payouts);

        // stdev needs all outcomes, so if "lost" games won't call increase we need to fix that
        let fullListOfOutcomes = this.payouts.slice();
        for (let i = 0; i < N - fullListOfOutcomes.length; i++) {
            fullListOfOutcomes.push(0);
        }
        let stdev = stats.stdev(fullListOfOutcomes);
        return this.formatter.format(n, amount, N, stdev);
    }
}

PayoutStandardDeviationCounter.DefaultFormatter = class extends GenericResult.GenericFormatter {
    format(n, amount, N, stdev) {
        return `${this.formatMoney(amount / N)} per game, ${this.formatMoney(amount / n)} per won game (${n} won games), total of ${this.formatMoney(amount)} (STDDEV: ${this.formatMoney(stdev)})`;
    }
};

PayoutStandardDeviationCounter.ListFormatter = class extends GenericResult.GenericFormatter {
    format(n, amount, N, stdev) {
        return `${n} (${this.formatPercent(n, N)}) - ${this.formatOneIn(n, N)} - Avg Payout: ${this.formatMoney(amount / n)} (total: ${this.formatMoney(amount)}, STDDEV: ${this.formatMoney(stdev)})`;
    }
};

module.exports = PayoutStandardDeviationCounter;
