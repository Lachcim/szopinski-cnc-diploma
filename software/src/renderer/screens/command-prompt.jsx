import React from "react";

import "style/command-prompt";

import WorkScreen from "renderer/components/work-screen";
import CommandPreview from "renderer/components/command-preview";
import CommandInput from "renderer/components/command-input";

export default function CommandPrompt() {
    return (
        <WorkScreen title="Command prompt">
            <div className="command-prompt">
                <CommandPreview/>
                <CommandInput/>
            </div>
        </WorkScreen>
    );
}
