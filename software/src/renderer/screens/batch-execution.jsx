import React, { useState } from "react";

import "style/batch-execution";

import WorkScreen from "renderer/components/work-screen";
import Dropzone from "renderer/components/dropzone";
import CommandPreview from "renderer/components/command-preview";

export default function CommandPrompt() {
    const [file, setFile] = useState(null);

    return (
        <WorkScreen title="Batch execution">
            <div className="batch-execution">
                {
                    file ? (
                        "o jezusku"
                    ) : (
                        <Dropzone onSubmit={setFile}/>
                    )
                }
            </div>
        </WorkScreen>
    );
}
