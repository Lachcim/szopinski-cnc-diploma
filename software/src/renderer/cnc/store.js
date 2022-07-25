import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { findFirstCommand } from "renderer/cnc/history-utils";
import Command from "renderer/cnc/command";

export const requestConnection = createAction("machine/connectionRequested");
export const setConnecting = createAction("machine/connecting");
export const connectionFailed = createAction("machine/connectionFailed");
export const requestDisconnect = createAction("machine/disconnectRequested");
export const setDisconnecting = createAction("machine/disconnecting");
export const disconnect = createAction("machine/disconnected");

export const sendCommand = createAction("machine/sendCommand");
export const commandSent = createAction("machine/commandSent");

export const timedFeedback = createAction("machine/timedFeedback");
export const commandStarted = createAction("machine/commandStarted");
export const commandFinished = createAction("machine/commandFinished");

const initialState = {
    connection: {
        port: null,
        status: "disconnected",
        error: null,
        updateRequested: false
    },
    machineState: null,
    commandHistory: []
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
            state.commandHistory.push(new Command(action.payload));
        });
        builder.addCase(commandSent, state => {
            //mark first unsent command in queue as sent
            findFirstCommand(state, "unsent").markSent();
        });

        builder.addCase(timedFeedback, (state, action) => {
            //connection established
            state.connection.status = "connected";

            //update position and buffer space
            state.machineState = {
                busy: state.machineState?.busy ?? false,
                bufferSpace: action.payload.bufferSpace,
                position: {
                    x: action.payload.machineX,
                    y: action.payload.machineY,
                    z: action.payload.machineZ
                }
            };
        });
        builder.addCase(commandStarted, (state, action) => {
            //obtain information about the executing command from the payload
            findFirstCommand(state, "sent").markExecuting(action.payload);
            state.machineState.busy = true;
        });
        builder.addCase(commandFinished, state => {
            //mark executing command as executed
            findFirstCommand(state, "executing").markExecuted();
            state.machineState.busy = false;
        });
    })
});
