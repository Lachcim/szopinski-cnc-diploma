import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "style/batch-execution";

import WorkScreen from "renderer/components/work-screen";
import Dropzone from "renderer/components/dropzone";
import CommandPreview from "renderer/components/command-preview";
import LinkButton from "renderer/components/link-button";

import { sendCommand, clearHistory } from "renderer/cnc/store";

export default function CommandPrompt() {
    const commandHistory = useSelector(state => state.commandHistory);
    const [file, setFile] = useState(null);
    const [commandPreview, setCommandPreview] = useState([]);
    const [executing, setExecuting] = useState(false);
    const dispatch = useDispatch();

    //construct command preview when selected file changes
    useEffect(() => {
        const generatePreview = async () => {
            const fileText = await file?.text();
            const dummyCommands = fileText
                .split(/[\r\n]+/)
                .filter(command => command.replace(/\s/, "").length > 0)
                .map(command => ({
                    text: command,
                    status: "preview",
                    stroke: null,
                    error: null
                }));

            setCommandPreview(dummyCommands);
        };

        if (file && commandPreview.length == 0)
            generatePreview();
    }, [file, commandPreview]);

    //mark execution as finished when once all commands have been executed
    useEffect(() => {
        if (commandHistory.length != commandPreview.length || commandHistory.length == 0)
            return;

        if (commandHistory[commandHistory.length - 1].status == "done")
            setExecuting(false);
    }, [commandHistory, commandPreview]);

    const execute = () => {
        dispatch(clearHistory());
        commandPreview.forEach(command => dispatch(sendCommand(command.text)));
        setExecuting(true);
    };
    const resetFile = () => {
        setFile(null);
        setCommandPreview([]);
    };

    const commands = executing ? commandHistory : commandPreview;

    return (
        <WorkScreen title="Batch execution">
            <div className="batch-execution">
                {
                    file ? (
                        <>
                            <div className="file-info">
                                <p className="file-name">
                                    { `${executing ? "Executing" : "Preview"}: ${file.name}` }
                                </p>
                                {
                                    file && !executing && (
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
                        <Dropzone onSubmit={setFile}/>
                    )
                }
            </div>
        </WorkScreen>
    );
}
