"use strict";

module.exports = {
    Simulator: require("./Simulator"),
    Results: {
        Generic: require("./result/Generic"),
        Counter: require("./result/Counter"),
        PayoutCounter: require("./result/PayoutCounter"),
        MapCounter: require("./result/MapCounter"),
        MapPayoutCounter: require("./result/MapPayoutCounter")
    }
};
