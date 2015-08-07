import GenericResult from './Generic.js';
import Counter from './Counter.js';
import _ from 'underscore';

export default class MapCounter extends GenericResult {
    constructor(keys, formatter = new MapCounter.DefaultFormatter) {
        super(formatter);
        this.map = {};
        this.order = keys;
        _.each(keys, (key) => {
            this.map[key] = new Counter();
        });
    }

    increase(key, by = 1) {
        if (this.map[key]) {
           this.map[key].increase(by);
        } else {
            throw new Error(`MapCounter: Key "${key}" not set up`);
        }
    }

    format(N) {
        return this.formatter.format(this.order, this.map, N);
    }
};

MapCounter.DefaultFormatter = class extends GenericResult.GenericFormatter  {
    format(order, map, N) {
        return order.map((key) => key + ": " + map[key].format(N));
    }
}