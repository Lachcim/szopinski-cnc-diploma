import React from "react";

import "style/batch-execution";

import WorkScreen from "renderer/components/work-screen";
import Dropzone from "renderer/components/dropzone";
import CommandPreview from "renderer/components/command-preview";

export default function CommandPrompt() {
    return (
        <WorkScreen title="Batch execution">
            <div className="batch-execution">
                <Dropzone/>
            </div>
        </WorkScreen>
    );
}
