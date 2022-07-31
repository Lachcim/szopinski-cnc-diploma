import React from "react";
import { useDispatch } from "react-redux";

import "style/command-prompt";

import WorkScreen from "renderer/components/work-screen";
import CommandPreview from "renderer/components/command-preview";
import CommandInput from "renderer/components/command-input";

export default function CommandPrompt() {
    const dispatch = useDispatch();

    return (
        <WorkScreen title="Command prompt">
            <div className="command-prompt">
                <CommandPreview/>
                <CommandInput/>
            </div>
        </WorkScreen>
    );
}
