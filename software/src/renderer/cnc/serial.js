import { SerialPort } from "serialport";
import { DelimiterParser } from "@serialport/parser-delimiter";
import {
    store,
    setConnecting,
    connectionFailed,
    requestDisconnect,
    setDisconnecting,
    disconnect,
    receiveFeedback,
    commandsSent,
    commandsConsumed
} from "renderer/cnc/state";
import FeedbackPacket from "renderer/cnc/feedback-packet";

let serialPort;
let timeout;
let firstReceived = false;

function registerTimeout() {
    timeout = setTimeout(() => {
        if (!serialPort.isOpen)
            return;

        store.dispatch(requestDisconnect("timedOut"));
    }, 500);
}

function sendCommands() {
    const state = store.getState();
    const textEncoder = new TextEncoder();

    //send commands until queue is empty or buffer is full
    let sentCommands = 0;
    let bufferSpace = state.machineState.bufferSpace;
    for (const command of state.commandQueue) {
        //encode command as UTF-8, add trailing newline to mark end of block
        const commandBytes = textEncoder.encode(command + "\n");

        //stop if no more space in buffer
        if (commandBytes.length > bufferSpace)
            break;

        serialPort.write(commandBytes);
        bufferSpace -= commandBytes.length;
        sentCommands++;
    }

    //move command queue
    if (sentCommands != 0)
        store.dispatch(commandsSent(sentCommands));
}

function updateCommandCounter(oldCounter) {
    //no old value to compare against
    if (oldCounter === null)
        return;

    //calculate number of consumed commands between feedback points
    const rawDelta = store.getState().machineState.commandCounter - oldCounter;
    const delta = rawDelta < 0 ? rawDelta + 256 : rawDelta;

    //update total command counter
    if (delta != 0)
        store.dispatch(commandsConsumed(delta));
}

function handleFeedback(data) {
    clearTimeout(timeout);

    //handle partial packet when first connecting
    const ignoreMalformed = !firstReceived;
    firstReceived = true;

    //validate data
    const packet = new FeedbackPacket(data);
    if (!packet.validate()) {
        if (!ignoreMalformed)
            store.dispatch(requestDisconnect("malformed"));

        return;
    }

    //get command counter value before update
    const oldCounter = store.getState().machineState?.commandCounter ?? null;

    //update global state with the received feedback, set timeout for next packet
    store.dispatch(receiveFeedback(packet.parse()));
    registerTimeout();

    //use updated state info to move the command queue
    sendCommands();
    updateCommandCounter(oldCounter);
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

    //handle new connection/disconnection requests
    if (!state.connection.updateRequested)
        return;

    if (state.connection.status == "connecting") {
        connect(state.connection.port);
        store.dispatch(setConnecting());
    }
    else {
        serialPort.close();
        firstReceived = false;
        store.dispatch(setDisconnecting());
    }
});
