import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import MicroScreen from "renderer/components/micro-screen";
import LargeButton from "renderer/components/large-button";
import LinkButton from "renderer/components/link-button";
import { VscTools, VscFileBinary, VscTerminal, VscEdit } from "react-icons/vsc";
import { requestDisconnect } from "renderer/cnc/store";

export default function WorkflowSelect() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const disconnect = () => {
        dispatch(requestDisconnect());
        navigate("/portSelect");
    };

    return (
        <MicroScreen>
            <h1>
                <VscTools/>
                Select a workflow
            </h1>
            <p>
                Choose how you wish to interact with the machine.
            </p>
            <div className="option-list">
                <LargeButton
                    icon={<VscFileBinary/>}
                    title="Batch program execution"
                >
                    Execute a program loaded from the file system
                </LargeButton>
                <LargeButton
                    icon={<VscTerminal/>}
                    title="Command prompt"
                    onClick={() => navigate("/commandPrompt")}
                >
                    Type and execute commands line by line
                </LargeButton>
                <LargeButton
                    icon={<VscEdit/>}
                    title="Bitmap tracing"
                >
                    Generate toolpath from a raster image
                </LargeButton>
            </div>
            <p className="footer-option">
                Or { " " }
                <LinkButton onClick={disconnect}>
                    choose a different machine
                </LinkButton>
            </p>
        </MicroScreen>
    );
}
