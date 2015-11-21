"use strict";

let GenericResult = require("./Generic.js");
let Counter = require("./Counter.js");
let _ = require("underscore");

class MapCounter extends GenericResult {
    constructor(keys, formatter) {
        formatter = formatter || new MapCounter.DefaultFormatter();
        super(formatter);
        this.map = {};
        this.order = keys;
        _.each(keys, (key) => {
            this.map[key] = new Counter();
        });
    }

    increase(key, by) {
        if (by === undefined) {
            by = 1;
        }
        if (this.map[key]) {
           this.map[key].increase(by);
        } else {
            throw new Error(`MapCounter: Key "${key}" not set up`);
        }
    }

    format(N) {
        return this.formatter.format(this.order, this.map, N);
    }
}

MapCounter.DefaultFormatter = class extends GenericResult.GenericFormatter  {
    format(order, map, N) {
        return order.map((key) => key + ": " + map[key].format(N));
    }
}

module.exports = MapCounter;
