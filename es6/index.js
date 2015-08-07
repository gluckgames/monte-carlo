import Simulator from "./Simulator";
import Generic from "./result/Generic";
import Counter from "./result/Counter";
import PayoutCounter from "./result/PayoutCounter";
import MapCounter from "./result/MapCounter";
import MapPayoutCounter from "./result/MapPayoutCounter";

export default {
    Simulator: Simulator,
    Results: {
        Generic: Generic,
        Counter: Counter,
        PayoutCounter: PayoutCounter,
        MapCounter: MapCounter,
        MapPayoutCounter: MapPayoutCounter
    }
};
