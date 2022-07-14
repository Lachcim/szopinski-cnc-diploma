import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";

export const requestConnection = createAction("machine/connectionRequested");
export const setConnecting = createAction("machine/connecting");
export const connectionFailed = createAction("machine/connectionFailed");
export const requestDisconnect = createAction("machine/disconnectRequested");
export const setDisconnecting = createAction("machine/disconnecting");
export const disconnect = createAction("machine/disconnected");

export const receiveFeedback = createAction("machine/feedbackReceived");
export const enqueueCommands = createAction("machine/enqueueCommands");
export const commandsSent = createAction("machine/commandsSent");
export const commandsConsumed = createAction("machine/commandsConsumed");

const initialState = {
    connection: {
        port: null,
        status: "disconnected",
        error: null,
        updateRequested: false
    },
    machineState: null,
    commandQueue: [],
    totalCommandCounter: 0
};

export const store = configureStore({
    reducer: createReducer(initialState, builder => {
        builder.addCase(requestConnection, (state, action) => {
            if (state.connection.status != "disconnected")
                return;

            state.connection = {
                port: action.payload,
                status: "connecting",
                error: null,
                updateRequested: true
            };
            state.commandQueue = [];
            state.totalCommandCounter = 0;
        });
        builder.addCase(setConnecting, state => {
            state.connection.status = "connecting";
            state.connection.updateRequested = false;
        });
        builder.addCase(connectionFailed, state => {
            state.connection.status = "disconnected";
            state.connection.error = "connectionFailed";
        });
        builder.addCase(requestDisconnect, (state, action) => {
            state.connection.status = "disconnecting";
            state.connection.error = action.payload ?? null;
            state.connection.updateRequested = true;
        });
        builder.addCase(setDisconnecting, state => {
            state.connection.status = "disconnecting";
            state.connection.updateRequested = false;
        });
        builder.addCase(disconnect, state => {
            state.connection.status = "disconnected";
            state.machineState = null;
        });

        builder.addCase(receiveFeedback, (state, action) => {
            state.connection.status = "connected";
            state.machineState = action.payload;
        });
        builder.addCase(enqueueCommands, (state, action) => {
            state.commandQueue.push(...action.payload);
        });
        builder.addCase(commandsSent, (state, action) => {
            state.commandQueue.splice(0, action.payload);
        });
        builder.addCase(commandsConsumed, (state, action) => {
            state.totalCommandCounter += action.payload;
        });
    })
});
