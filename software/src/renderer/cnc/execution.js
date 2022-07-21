export function moveExecutionQueue(state, newMachineState) {
    const parityChanged = newMachineState.commandParity != state.machineState.commandParity;
    const busyChanged = newMachineState.busy != state.machineState.busy;

    //execution queue is moved by parity changes
    if (!parityChanged) {
        //edge case: final command finished executing
        if (!newMachineState.busy && state.machineState.busy) {
            state.commands.history[state.commands.executionIndex].markExecuted();
            state.commands.executionIndex = null;
        }

        return;
    }

    //first command is executing
    if (busyChanged && newMachineState.busy) {
        state.commands.history[state.commands.executionIndex].markExecuting();
    }
}
