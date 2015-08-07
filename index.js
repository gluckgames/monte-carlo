module.exports = {
    Simulator: require("./src/Simulator"),
    Results: {
        Generic: require("./src/result/Generic"),
        Counter: require("./src/result/Counter"),
        PayoutCounter: require("./src/result/PayoutCounter"),
        MapCounter: require("./src/result/MapCounter"),
        MapPayoutCounter: require("./src/result/MapPayoutCounter")
    }
};
