import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter";
import {
    store,
    setConnecting,
    receiveFeedback,
    connectionFailed,
    requestDisconnect,
    setDisconnecting,
    disconnect
} from "renderer/cnc/state";
import FeedbackPacket from "renderer/cnc/feedback-packet";

export let serialPort;
let timeout;

function registerTimeout() {
    timeout = setTimeout(() => {
        if (!serialPort.isOpen)
            return;

        store.dispatch(requestDisconnect("timedOut"));
    }, 500);
}

function handleFeedback(data) {
    clearTimeout(timeout);

    //validate data
    const packet = new FeedbackPacket(data);
    if (!packet.validate()) {
        store.dispatch(requestDisconnect("malformed"));
        return;
    }

    //update global state with the received feedback
    store.dispatch(receiveFeedback(packet.parse()));

    //set timeout for next packet
    registerTimeout();
}

function connect(port) {
    //attempt to open a connection
    serialPort = new SerialPort({
        path: port,
        baudRate: 9600
    });

    //handle errors and register initial timeout
    serialPort.on("close", error => {
        if (error) store.dispatch(connectionFailed());
        else store.dispatch(disconnect());
    });
    serialPort.on("error", () => store.dispatch(connectionFailed()));
    serialPort.on("open", registerTimeout);

    //pipe connection through delimiter parser
    const parser = new DelimiterParser({ delimiter: "PLOTFEEDBACK" });
    parser.on("data", handleFeedback);
    serialPort.pipe(parser);
}

//subscribe to all changes in the store
store.subscribe(() => {
    const state = store.getState();

    //only handle new connection requests
    if (!state.connection.updateRequested)
        return;

    if (state.connection.status == "connecting") {
        connect(state.connection.port);
        store.dispatch(setConnecting());
    }
    else {
        serialPort.close();
        store.dispatch(setDisconnecting());
    }
});
