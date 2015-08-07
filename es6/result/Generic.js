export default class GenericResult {
    constructor(formatter) {
        this.formatter = formatter;
    }
}

GenericResult.GenericFormatter = class GenericFormatter {
    setAccuracy(digits) {
        this.settings.accuracyInDigits = digits;
        return this;
    }

    formatPercent(n, N) {
        return (n / N * 100).toFixed(2) + "%";
    }

    formatOneIn(n, N) {
        return "1 in " + (N / n).toFixed(2);
    }

    formatMoney(amount) {
        return `£${amount.toFixed(2)}`;
    }
}
