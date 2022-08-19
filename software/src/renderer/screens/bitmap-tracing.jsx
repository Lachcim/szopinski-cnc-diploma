import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "style/bitmap-tracing";

import WorkScreen from "renderer/components/work-screen";
import Dropzone from "renderer/components/dropzone";
import CommandPreview from "renderer/components/command-preview";
import LinkButton from "renderer/components/link-button";

import { sendCommand, clearHistory } from "renderer/cnc/store";

export default function BitmapTracing() {
    const commandHistory = useSelector(state => state.commandHistory);
    const [file, setFile] = useState(null);

    return (
        <WorkScreen title="Bitmap tracing">
            <div className="bitmap-tracing">
                {
                    file ? (
                        <>
                            o jezusku
                        </>
                    ) : (
                        <Dropzone onSubmit={setFile}/>
                    )
                }
            </div>
        </WorkScreen>
    );
}
