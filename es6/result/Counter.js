import GenericResult from './Generic.js';

export default class Counter extends GenericResult {
    constructor(formatter = new Counter.OutcomeFormatter()) {
        super(formatter)
        this.n = 0;
    }

    increase(by = 1) {
        this.n += by;
    }

    format(N) {
        return this.formatter.format(this.n, N);
    }
};

Counter.OutcomeFormatter = class extends GenericResult.GenericFormatter {
    format(n, N) {
        return `${n} (${this.formatPercent(n, N)}) - ${this.formatOneIn(n, N)}`;
    }
};

Counter.EventFormatter = class extends GenericResult.GenericFormatter {
    format(n, N) {
        return `${(n / N).toFixed(2)} per game`;
    }
};
