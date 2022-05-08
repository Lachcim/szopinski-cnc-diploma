import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";

export const requestConnection = createAction("machine/connectionRequested");
export const setConnecting = createAction("machine/connecting");
export const receiveFeedback = createAction("machine/feedbackReceived");
export const connectionFailed = createAction("machine/connectionFailed");
export const requestDisconnect = createAction("machine/disconnectRequested");
export const setDisconnecting = createAction("machine/disconnecting");
export const disconnect = createAction("machine/disconnected");

const initialState = {
    connection: {
        port: null,
        status: "disconnected",
        error: null,
        updateRequested: false
    },
    machineState: null
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
        });
        builder.addCase(setConnecting, state => {
            state.connection.status = "connecting";
            state.connection.updateRequested = false;
        });
        builder.addCase(receiveFeedback, (state, action) => {
            state.connection.status = "connected";
            state.machineState = action.payload;
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
    })
});
