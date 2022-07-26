import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { findFirstCommand } from "renderer/cnc/history-utils";

export const requestConnection = createAction("machine/connectionRequested");
export const setConnecting = createAction("machine/connecting");
export const connectionFailed = createAction("machine/connectionFailed");
export const requestDisconnect = createAction("machine/disconnectRequested");
export const setDisconnecting = createAction("machine/disconnecting");
export const disconnect = createAction("machine/disconnected");

export const sendCommand = createAction("machine/sendCommand");
export const commandSent = createAction("machine/commandSent");

export const positionFeedback = createAction("machine/positionFeedback");
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
            state.commandHistory.push({
                text: action.payload,
                status: "unsent",
                stroke: null,
                error: null
            });
        });
        builder.addCase(commandSent, state => {
            //mark first unsent command in queue as sent
            findFirstCommand(state, "unsent").status = "sent";
        });

        builder.addCase(positionFeedback, (state, action) => {
            //connection established
            state.connection.status = "connected";

            //initialize machine state if newly connected
            if (!state.machineState) {
                state.machineState = {
                    busy: false,
                    bufferSpace: 255
                };
                state.commandHistory = [];
            }

            //update position
            state.machineState.position = {
                x: action.payload.machineX,
                y: action.payload.machineY,
                z: action.payload.machineZ
            };
        });
        builder.addCase(commandStarted, (state, action) => {
            //mark command as executing
            const command = findFirstCommand(state, "sent");
            command.status = "executing";
            state.machineState.busy = true;

            //error in command, no stroke info
            if (action.payload.error) {
                command.error = action.payload.error;
                return;
            }

            //remember stroke interpretation
            command.stroke = {
                type: action.payload.strokeType,
                origin: {
                    x: action.payload.originX,
                    y: action.payload.originY,
                    z: action.payload.originZ
                },
                destination: {
                    x: action.payload.destinationX,
                    y: action.payload.destinationY,
                    z: action.payload.destinationZ
                }
            };
            if (action.payload.strokeType == "arc" || action.payload.strokeType == "ccwArc") {
                this.stroke.center = {
                    x: action.payload.centerX,
                    y: action.payload.centerY,
                    z: action.payload.centerZ
                };
            }
        });
        builder.addCase(commandFinished, state => {
            //mark executing command as executed
            findFirstCommand(state, "executing").status = "executed";
            state.machineState.busy = false;
        });
    })
});
