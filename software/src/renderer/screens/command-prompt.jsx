import React from "react";
import { useSelector, useDispatch } from "react-redux";

import "style/command-prompt";

import WorkScreen from "renderer/components/work-screen";
import CommandPreview from "renderer/components/command-preview";
import CommandInput from "renderer/components/command-input";

import { sendCommand } from "renderer/cnc/store";

export default function CommandPrompt() {
    const commands = useSelector(state => state.commandHistory);
    const dispatch = useDispatch();

    return (
        <WorkScreen title="Command prompt">
            <div className="command-prompt">
                <CommandPreview commands={commands}/>
                <CommandInput onSubmit={command => dispatch(sendCommand(command))}/>
            </div>
        </WorkScreen>
    );
}
