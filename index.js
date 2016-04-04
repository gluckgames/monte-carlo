module.exports = {
    Simulator: require("./lib/Simulator"),
    Results: {
        Generic: require("./lib/result/Generic"),
        Counter: require("./lib/result/Counter"),
        PayoutCounter: require("./lib/result/PayoutCounter"),
        PayoutStandardDeviationCounter: require("./lib/result/PayoutStandardDeviationCounter"),
        MapCounter: require("./lib/result/MapCounter"),
        MapPayoutCounter: require("./lib/result/MapPayoutCounter")
    }
};
