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

let connection;
let timeout;

function registerTimeout() {
    timeout = setTimeout(() => {
        if (!connection.isOpen)
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
    connection = new SerialPort({
        path: port,
        baudRate: 9600
    });

    //handle errors and register initial timeout
    connection.on("close", error => {
        if (error) store.dispatch(connectionFailed());
        else store.dispatch(disconnect());
    });
    connection.on("error", () => store.dispatch(connectionFailed()));
    connection.on("open", registerTimeout);

    //pipe connection through delimiter parser
    const parser = new DelimiterParser({ delimiter: "PLOTFEEDBACK" });
    parser.on("data", handleFeedback);
    connection.pipe(parser);
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
        connection.close();
        store.dispatch(setDisconnecting());
    }
});
