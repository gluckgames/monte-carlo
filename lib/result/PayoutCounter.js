"use strict";

let GenericResult = require("./Generic.js");
let Counter = require("./Counter.js");

class PayoutCounter extends Counter {
    constructor(formatter) {
        formatter = formatter || new PayoutCounter.DefaultFormatter();

        super(formatter);
        this.n = 0;
        this.amount = 0;
    }

    increase(by) {
        if (by > 0) {
            this.amount += by;
        }
        this.n += 1;
    }

    format(N) {
        return this.formatter.format(this.n, this.amount, N);
    }
}

PayoutCounter.DefaultFormatter = class extends GenericResult.GenericFormatter {
    format(n, amount, N) {
        return `${this.formatMoney(amount / N)} per game, ${this.formatMoney(amount / n)} per won game (${n} won games), total of ${this.formatMoney(amount)}`;
    }
};

PayoutCounter.ListFormatter = class extends GenericResult.GenericFormatter {
    format(n, amount, N) {
        return `${n} (${this.formatPercent(n, N)}) - ${this.formatOneIn(n, N)} - Avg Payout: ${this.formatMoney(amount / n)} (total: ${this.formatMoney(amount)})`;
    }
};

module.exports = PayoutCounter;
