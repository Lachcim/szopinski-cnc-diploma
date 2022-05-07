import { createStore } from "redux";
import machineReducer from "main/state/machine-reducer";

const store = createStore(machineReducer, {
    connection: {
        port: null,
        status: "disconnected",
        error: null
    },
    machineState: null
});

export default store;
