export default function machineReducer(state, action) {
    const connectionErrorDict = {
        CONNECTION_FAILED: "connectionFailed",
        CONNECTION_TIMED_OUT: "timedOut",
        MALFORMED_FEEDBACK: "malformed"
    };

    switch (action.type) {
        case "CONNECTION_REQUESTED":
            return {
                ...state,
                connection: {
                    port: action.payload,
                    status: "connecting",
                    error: null
                },
            };
        case "CONNECTION_FAILED":
        case "CONNECTION_TIMED_OUT":
        case "MALFORMED_FEEDBACK":
            return {
                connection: {
                    ...state.connection,
                    status: "disconnected",
                    error: connectionErrorDict[action.type]
                },
                machineState: null
            };
        case "DISCONNECT_REQUESTED":
            return {
                connection: {
                    ...state.connection,
                    status: "disconnected",
                    error: null
                },
                machineState: null
            };
        case "MACHINE_FEEDBACK":
            return {
                connection: {
                    ...state.connection,
                    status: "connected",
                    error: null,
                },
                machineState: action.payload
            };
        default:
            return state;
    }
}
