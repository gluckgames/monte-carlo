import GenericResult from "./Generic.js";
import PayoutCounter from "./PayoutCounter.js";
import _ from "underscore";

export default class MapPayoutCounter extends GenericResult {
    constructor(keys, formatter = new MapPayoutCounter.DefaultFormatter()) {
        super(formatter);
        this.map = {};
        this.order = keys;
        this.sumIsEnabled = false;
        _.each(keys, (key) => {
            this.map[key] = new PayoutCounter( new PayoutCounter.ListFormatter() );
        });
    }

    enableSum() {
        this.order.push("SUM");
        this.map.SUM = new PayoutCounter( new PayoutCounter.ListFormattor() );
        this.sumIsEnabled = true;
    }

    increase(key, by = 1) {
        if (this.map[key]) {
            this.map[key].increase(by);
            if (this.sumIsEnabled) {
                this.map.SUM.increase(by);
            }
        } else {
            throw new Error(`MapPayoutCounter: Key "${key}" not set up`);
        }
    }

    format(N) {
        return this.formatter.format(this.order, this.map, N);

    }
}

MapPayoutCounter.DefaultFormatter = class extends GenericResult.GenericFormatter  {
    format(order, map, N) {
        return order.map((key) => key + ": " + map[key].format(N));
    }
};
