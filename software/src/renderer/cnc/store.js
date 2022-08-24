import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { findFirstCommand } from "renderer/cnc/history-utils";

export const connect = createAction("machine/connect");
export const connectionFailed = createAction("machine/connectionFailed");
export const disconnect = createAction("machine/disconnect");
export const disconnected = createAction("machine/disconnected");

export const sendCommand = createAction("machine/sendCommand");
export const commandSent = createAction("machine/commandSent");
export const clearHistory = createAction("machine/clearHistory");

export const positionFeedback = createAction("machine/positionFeedback");
export const commandStarted = createAction("machine/commandStarted");
export const commandFinished = createAction("machine/commandFinished");

const initialState = {
    connection: {
        port: null,
        status: "disconnected",
        error: null,
        bufferSpace: null
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
                error: null,
                bufferSpace: null
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
            //no empty commands
            if (action.payload.replace(/\s/, "").length == 0)
                return;

            //add command to history
            state.commandHistory.push({
                text: action.payload,
                bufferSize: null,
                status: "unsent",
                stroke: null,
                error: null
            });
        });
        builder.addCase(commandSent, (state, action) => {
            //update first unsent command in queue
            const command = findFirstCommand(state, "unsent");
            command.status = "sent";
            command.bufferSize = action.payload;

            //subtract command size from buffer space
            state.connection.bufferSpace -= command.bufferSize;
        });
        builder.addCase(clearHistory, state => {
            //remove all executed commands from history
            state.commandHistory = state.commandHistory.filter(command =>
                command.status != "done"
            );
        });

        builder.addCase(positionFeedback, (state, action) => {
            //initialize state if newly connected
            if (state.connection.status != "connected") {
                state.machineState = { busy: false };
                state.connection.bufferSpace = 254;
                state.commandHistory = [];
            }

            //connection established
            state.connection.status = "connected";

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
            state.connection.bufferSpace += command.bufferSize;

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
                command.stroke.center = {
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
