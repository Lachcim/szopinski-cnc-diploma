export const requestConnection = (port) => ({
    type: "CONNECTION_REQUESTED",
    payload: port
});

export const connectionFailed = () => ({
    type: "CONNECTION_FAILED"
});

export const connectionTimedOut = () => ({
    type: "CONNECTION_TIMED_OUT"
});

export const malformedFeedback = () => ({
    type: "CONNECTION_TIMED_OUT"
});

export const requestDisconnection = () => ({
    type: "DISCONNECT_REQUESTED"
});

export const receiveFeedback = (machineState) => ({
    type: "MACHINE_FEEDBACK",
    payload: machineState
});
