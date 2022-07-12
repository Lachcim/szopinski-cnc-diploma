import { store } from "renderer/cnc/state";
import { serialPort } from "renderer/cnc/serial";

export default class CNCSender {
    constructor() {
        this.commandQueue = [];
        this.counterDelta = 0;

        this.onInitialBusyCleared = null;
        this.onDeltaChange = null;

        //obtain initial machine state
        this.machineState = store.getState().machineState;
        this.initialBusy = this.machineState.busy;

        //listen to changes in the store
        this.unsubscribe = store.subscribe(() => this.onStoreChange());
    }

    enqueue(commands) {
        //add commands to queue and attempt to send immediately
        this.commandQueue.push(...commands);
        this.trySend();
    }

    trySend() {
        //exclusive control not yet assumed
        if (this.initialBusy)
            return;

        const encoder = new TextEncoder();
        let bufferSpace = this.machineState.bufferSpace;

        //send all commands in queue
        while (this.commandQueue.length > 0) {
            //encode command as UTF-8, add trailing newline
            const commandBytes = encoder.encode(this.commandQueue[0] + "\n");

            //stop if no more space in buffer
            if (commandBytes.length > bufferSpace)
                break;

            //send command, subtract space, remove command from queue
            serialPort.write(commandBytes);
            bufferSpace -= commandBytes.length;
            this.commandQueue.shift();
        }
    }

    onStoreChange() {
        const newMachineState = store.getState().machineState;

        //only examine machine state changes, escape if machine disconnected
        if (newMachineState == this.machineState || !newMachineState)
            return;

        //assume exclusive control over machine
        if (this.initialBusy && !newMachineState.busy) {
            this.initialBusy = false;
            this.onInitialBusyCleared?.();
        }

        //calculate delta = how many commands were executed since last feedback
        const rawDelta = newMachineState.commandCounter - this.machineState.commandCounter;
        const delta = rawDelta < 0 ? rawDelta + 256 : rawDelta;

        if (delta > 0) {
            this.counterDelta += delta;
            this.onDeltaChange?.(this.counterDelta);
        }

        //update machine state and attempt to move queue
        this.machineState = newMachineState;
        this.trySend();
    }

    disconnect() {
        //remove reference to sender at the store, allow sender to be garbage collected
        this.unsubscribe();
    }
}
