import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { findFirstCommand } from "renderer/cnc/history-utils";

export const connect = createAction("machine/connect");
export const connectionFailed = createAction("machine/connectionFailed");
export const disconnect = createAction("machine/disconnect");
export const disconnected = createAction("machine/disconnected");

export const sendCommand = createAction("machine/sendCommand");
export const commandSent = createAction("machine/commandSent");

export const positionFeedback = createAction("machine/positionFeedback");
export const commandStarted = createAction("machine/commandStarted");
export const commandFinished = createAction("machine/commandFinished");

const initialState = {
    connection: {
        port: null,
        status: "disconnected",
        error: null
    },
    machineState: null,
    commandHistory: []
};

export const store = configureStore({
    reducer: createReducer(initialState, builder => {
        builder.addCase(connect, (state, action) => {
            //connection may only be requested when disconnected
            if (state.connection.status != "disconnected")
                return;

            state.connection = {
                port: action.payload,
                status: "connecting",
                error: null
            };
        });
        builder.addCase(connectionFailed, state => {
            //fault detected by serial interface, mark as diconnected
            state.connection.status = "disconnected";
            state.connection.error = "connectionFailed";
        });
        builder.addCase(disconnect, (state, action) => {
            //request disconnection
            state.connection.status = "disconnecting";
            state.connection.error = action.payload ?? null;
        });
        builder.addCase(disconnected, state => {
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
            findFirstCommand(state, "executing").status = "done";
            state.machineState.busy = false;
        });
    })
});
