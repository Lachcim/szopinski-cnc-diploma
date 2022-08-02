import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter";
import FeedbackPacket from "renderer/cnc/feedback-packet";
import {
    store,
    connectionFailed,
    disconnect,
    disconnected,
    commandSent,
    positionFeedback,
    commandStarted,
    commandFinished
} from "renderer/cnc/store";
import { findFirstCommand } from "renderer/cnc/history-utils";

let serialPort;
let timeout;
let firstReceived;

function resetTimeout() {
    //clear previous timeout
    clearTimeout(timeout);

    //register new timeout
    timeout = setTimeout(() => {
        //not an error when the connection is closed
        if (!serialPort.isOpen)
            return;

        store.dispatch(disconnect("timedOut"));
    }, 500);
}

function sendCommands() {
    const textEncoder = new TextEncoder();
    let bufferSpace = store.getState().machineState.bufferSpace;

    while (true) {
        //obtain first command in queue
        const command = findFirstCommand(store.getState(), "unsent");
        if (!command)
            return;

        //no more room in buffer
        const commandBytes = textEncoder.encode(command.text + "\n");
        if (commandBytes.length > bufferSpace)
            return;

        //write command to serial, update queue
        serialPort.write(commandBytes);
        bufferSpace -= commandBytes.length;
        store.dispatch(commandSent());
    }
}

function handleFeedback(data) {
    //reset receive timeout
    resetTimeout();

    //handle partial data when receiving for the first time
    const ignoreMalformed = !firstReceived;
    firstReceived = true;

    //validate data
    const packet = new FeedbackPacket(data);
    if (!packet.validate()) {
        if (!ignoreMalformed)
            store.dispatch(disconnect("malformed"));

        return;
    }

    //update global state with the received feedback
    const packetData = packet.parse();

    if (packetData.type == "position") {
        store.dispatch(positionFeedback(packetData));
        return;
    }

    if (!packetData.finished) {
        //send commands when buffer space becomes known
        store.dispatch(commandStarted(packetData));
        sendCommands();
    }
    else
        store.dispatch(commandFinished());
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
        else store.dispatch(disconnected());
    });
    serialPort.on("error", () => store.dispatch(connectionFailed()));
    serialPort.on("open", resetTimeout);

    //pipe connection through delimiter parser
    const parser = new DelimiterParser({ delimiter: "PLOTFEEDBACK" });
    parser.on("data", handleFeedback);
    serialPort.pipe(parser);

    //ignore first received packet
    firstReceived = false;
}

let prevConnectionStatus = "disconnected";
let prevCommandCount = 0;

//subscribe to all changes in the store
store.subscribe(() => {
    const state = store.getState();

    //handle new connection/disconnection requests
    if (!state.connection.status != prevConnectionStatus) {
        prevConnectionStatus = state.connection.status;

        if (state.connection.status == "connecting")
            connect(state.connection.port);
        else if (state.connection.status == "disconnecting")
            serialPort.close();
    }

    //handle new commands
    if (state.commandHistory.length != prevCommandCount) {
        prevCommandCount = state.commandHistory.length;

        if (!findFirstCommand(state, "sent"))
            sendCommands();
    }
});
