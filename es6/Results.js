import _ from 'underscore';

export default class Results {
    constructor() {
        this.orderOfNames = [];
    }

    add(name, resultModule) {
        this[name] = resultModule;
        this.orderOfNames.push(name);
        return this;
    }

    format(N) {
        return _.flatten(this.orderOfNames.map((name) => {
            let output = this[name].format(N);
            if (_.isArray(output)) {
                output = output.map((line) => { return "  " + line; });
                output.unshift(name + ":");
                return output;
            } else {
                return [name + ": " + output.toString()];
            }
        }));
    }
}