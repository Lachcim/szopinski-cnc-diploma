import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter";
import store from "renderer/state/store";
import {
    connectionFailed,
    connectionTimedOut,
    malformedFeedback,
    receiveFeedback
} from "renderer/state/actions";

let connection = null;
let timeout;

const errorDict = [
    null,
    "bufferOverflow",
    "blockDelete",
    "malformedInput",
    "unsupportedFeature",
    "duplicateWord",
    "conflictingModal",
    "missingArgument",
    "invalidArgument"
];

function registerTimeout() {
    //dispatch timeout event if no feedback received in due time
    timeout = setTimeout(() => store.dispatch(connectionTimedOut()), 500);
}

function validatePacket(data) {
    //all fields take exactly 10 bytes
    if (data.length != 10)
        return false;

    //busy field is a boolean
    if (data[0] > 1)
        return false;

    //error must be mapped
    if (errorDict[data[2]] === undefined)
        return false;

    return true;
}

function handleFeedback(data) {
    //data received in time, prevent timeout error
    clearTimeout(timeout);

    //validate data
    if (!validatePacket(data)) {
        store.dispatch(malformedFeedback());
        return;
    }

    //update global state with the received feedback
    store.dispatch(receiveFeedback({
        busy: Boolean(data[0]),
        commandCounter: data[1],
        error: errorDict[data[2]],
        machinePos: {
            x: data[3] & data[4] << 8,
            y: data[5] & data[6] << 8,
            z: data[7] & data[8] << 8
        },
        bufferSpace: data[9]
    }));

    //set timeout for next packet
    registerTimeout();
}

//subscribe to all changes in the store
store.subscribe(() => {
    const state = store.getState();
    const portChanged = connection?.path != state.connection.port;

    //only handle new connection requests
    if (state.connection.status != "connecting" || !portChanged)
        return;

    //attempt to open a connection
    connection = new SerialPort({
        path: state.connection.port,
        baudRate: 9600
    });

    //handle errors and register initial timeout
    connection.on("error", () => store.dispatch(connectionFailed()));
    connection.on("open", registerTimeout);

    //pipe connection through delimiter parser
    const parser = new DelimiterParser({ delimiter: "PLOTFEEDBACK" });
    parser.on("data", handleFeedback);
    connection.pipe(parser);
});
