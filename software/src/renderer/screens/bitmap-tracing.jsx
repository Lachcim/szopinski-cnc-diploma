import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "style/bitmap-tracing";

import WorkScreen from "renderer/components/work-screen";
import SlideScreen from "renderer/components/slide-screen";

import Dropzone from "renderer/components/dropzone";
import CommandPreview from "renderer/components/command-preview";
import LinkButton from "renderer/components/link-button";

import { traceBitmap } from "renderer/cnc/trace";
import { sendCommand, clearHistory } from "renderer/cnc/store";

export default function BitmapTracing() {
    const commandHistory = useSelector(state => state.commandHistory);
    const [fileName, setFileName] = useState(null);
    const [traceResult, setTraceResult] = useState(null);
    const [executing, setExecuting] = useState(false);
    const dispatch = useDispatch();

    //mark execution as finished when once all commands have been executed
    useEffect(() => {
        if (commandHistory.at(-1)?.status == "done")
            setExecuting(false);
    }, [commandHistory]);

    //trace bitmap when the file is loaded
    const loadFile = async (file) => {
        setFileName(file.name);

        const traceResult = await traceBitmap(file);
        setTraceResult(traceResult);
    };

    //draw trace result on canvas
    const updateCanvas = canvas => {
        if (!canvas || !traceResult)
            return;

        //resize canvas
        canvas.width = traceResult.imageData.width;
        canvas.height = traceResult.imageData.height;

        //draw image data
        const context = canvas.getContext("2d");
        context.putImageData(traceResult.imageData, 0, 0);
    };

    //clear history and issue each generated command
    const execute = () => {
        dispatch(clearHistory());
        traceResult.commands.forEach(command => dispatch(sendCommand(command)));
        setExecuting(true);
    };

    const resetFile = () => {
        setFileName(null);
        setTraceResult(null);
    }

    const getScreenKey = () => {
        if (!traceResult) return "dropzone";
        if (!executing) return "preview";
        return "executing";
    }

    const getScreen = () => {
        if (!traceResult) {
            return (
                <Dropzone onSubmit={loadFile}/>
            );
        }
        if (executing) {
            return (
                <>
                    <p className="command-preview-file-info">Executing: {fileName}</p>
                    <CommandPreview commands={commandHistory}/>
                </>
            );
        }

        return (
            <div className="trace-preview">
                <div>
                    <p className="file-info">Trace preview: { fileName }</p>
                    <canvas
                        className="trace-canvas"
                        ref={updateCanvas}
                    />
                    <div className="actions">
                        <button onClick={execute}>
                            Execute
                        </button>
                        <p>
                            <LinkButton onClick={resetFile}>
                                discard
                            </LinkButton>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <WorkScreen title="Bitmap tracing">
            <div className="bitmap-tracing">
                <SlideScreen screenKey={getScreenKey()}>
                    { getScreen() }
                </SlideScreen>
            </div>
        </WorkScreen>
    );
}
