import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { moveExecutionQueue } from "renderer/cnc/execution";

export const requestConnection = createAction("machine/connectionRequested");
export const setConnecting = createAction("machine/connecting");
export const connectionFailed = createAction("machine/connectionFailed");
export const requestDisconnect = createAction("machine/disconnectRequested");
export const setDisconnecting = createAction("machine/disconnecting");
export const disconnect = createAction("machine/disconnected");

export const sendCommand = createAction("machine/sendCommand");
export const commandSent = createAction("machine/commandSent");

export const receiveFeedback = createAction("machine/feedbackReceived");

const initialState = {
    connection: {
        port: null,
        status: "disconnected",
        error: null,
        updateRequested: false
    },
    machineState: null,
    commands: {
        history: [],
        queueIndex: null,
        executionIndex: null
    }
};

export const store = configureStore({
    reducer: createReducer(initialState, builder => {
        builder.addCase(requestConnection, (state, action) => {
            //connection may only be requested when disconnected
            if (state.connection.status != "disconnected")
                return;

            //request connection, set connection port and raise update flag
            state.connection = {
                port: action.payload,
                status: "connecting",
                error: null,
                updateRequested: true
            };
        });
        builder.addCase(setConnecting, state => {
            //connection is being opened by the serial interface, lower update flag
            state.connection.status = "connecting";
            state.connection.updateRequested = false;
        });
        builder.addCase(connectionFailed, state => {
            //fault detected by serial interface, mark as diconnected
            state.connection.status = "disconnected";
            state.connection.error = "connectionFailed";
        });
        builder.addCase(requestDisconnect, (state, action) => {
            //request disconnection, raise update flag
            state.connection.status = "disconnecting";
            state.connection.error = action.payload ?? null;
            state.connection.updateRequested = true;
        });
        builder.addCase(setDisconnecting, state => {
            //connection is being closed, lower update flag
            state.connection.status = "disconnecting";
            state.connection.updateRequested = false;
        });
        builder.addCase(disconnect, state => {
            //connection closed, mark as disconnected
            state.connection.status = "disconnected";
            state.machineState = null;
        });

        builder.addCase(sendCommand, (state, action) => {
            //add command to history
            state.commands.history.push(action.payload);

            //if the queue is empty, mark start of queue
            if (state.commands.queueIndex == null)
                state.commands.queueIndex = state.commands.history.length - 1;
        });
        builder.addCase(commandSent, state => {
            //mark currently queued command as sent
            state.commands.history[state.commands.queueIndex].markSent();

            //move queue
            state.commands.queueIndex++;
            if (state.commands.queueIndex == state.commands.history.length)
                state.commands.queueIndex = null;
        });

        builder.addCase(receiveFeedback, (state, action) => {
            if (state.machineState)
                moveExecutionQueue(state, action.payload);

            state.connection.status = "connected";
            state.machineState = action.payload;
        });
    })
});
