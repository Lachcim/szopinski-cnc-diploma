import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "style/batch-execution";

import WorkScreen from "renderer/components/work-screen";
import SlideScreen from "renderer/components/slide-screen";

import Dropzone from "renderer/components/dropzone";
import CommandPreview from "renderer/components/command-preview";
import LinkButton from "renderer/components/link-button";

import { sendCommand, clearHistory } from "renderer/cnc/store";

export default function CommandPrompt() {
    const commandHistory = useSelector(state => state.commandHistory);
    const [fileName, setFileName] = useState(null);
    const [commandPreview, setCommandPreview] = useState([]);
    const [executing, setExecuting] = useState(false);
    const dispatch = useDispatch();

    //mark execution as finished when once all commands have been executed
    useEffect(() => {
        if (commandHistory.at(-1)?.status == "done")
            setExecuting(false);
    }, [commandHistory]);

    //construct command preview when the file is loaded
    const loadFile = async (file) => {
        setFileName(file.name);

        const fileText = await file?.text();
        const dummyCommands = fileText
            .split(/[\r\n]+/)
            .filter(command => command.replace(/\s/, "").length != 0)
            .map(command => ({
                text: command,
                bufferSize: null,
                status: "preview",
                stroke: null,
                error: null
            }));

        setCommandPreview(dummyCommands);
    };

    //clear history and issue each command from the preview
    const execute = () => {
        dispatch(clearHistory());
        commandPreview.forEach(command => dispatch(sendCommand(command.text)));
        setExecuting(true);
    };

    const resetFile = () => {
        setFileName(null);
        setCommandPreview([]);
    };

    const commands = executing ? commandHistory : commandPreview;

    return (
        <WorkScreen title="Batch execution">
            <div className="batch-execution">
                <SlideScreen screenKey={commandPreview.length != 0}>
                    {
                        commandPreview.length != 0 ? (
                            <>
                                <div className="file-info">
                                    <p className="file-name">
                                        { `${executing ? "Executing" : "Preview"}: ${fileName}` }
                                    </p>
                                    {
                                        !executing && (
                                            <div className="actions">
                                                <LinkButton onClick={resetFile}>
                                                    discard
                                                </LinkButton>
                                                <button onClick={execute}>
                                                    Execute
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                                <CommandPreview commands={commands}/>
                            </>
                        ) : (
                            <Dropzone onSubmit={loadFile}/>
                        )
                    }
                </SlideScreen>
            </div>
        </WorkScreen>
    );
}
