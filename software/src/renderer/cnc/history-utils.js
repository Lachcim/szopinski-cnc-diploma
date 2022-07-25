export function findFirstCommand(state, rawStatus) {
    //map statuses to their order
    const statusDict = {
        "unsent": 0,
        "sent": 1,
        "executing": 2,
        "executed": 3
    };
    const status = statusDict[rawStatus];

    //look for first instance of a later-occurring status
    for (let i = state.commandHistory.length - 2; i >= 0; i--) {
        const command = state.commandHistory[i];
        const prevCommand = state.commandHistory[i + 1];

        //later-occurring status found
        if (statusDict[command.status] > status) {
            //first instance of sought status must exist at the boundary
            if (prevCommand.status == rawStatus)
                return prevCommand;

            return null;
        }
    }

    //no later-occurring status found, check if first element matches criterion
    if (state.commandHistory.length > 0 && state.commandHistory[0].status == rawStatus)
        return state.commandHistory[0];

    return null;
}
