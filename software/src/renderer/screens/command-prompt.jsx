import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendCommand } from "renderer/cnc/store";

import "style/command-prompt";

import WorkScreen from "renderer/components/work-screen";
import CommandPreview from "renderer/components/command-preview";

export default function CommandPrompt() {
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => dispatch(sendCommand("g0 x50")), 1000);
        setTimeout(() => dispatch(sendCommand("x150 y50")), 3000);
        setTimeout(() => dispatch(sendCommand("g1 x0 y0")), 5000);
        setTimeout(() => {
            dispatch(sendCommand("g0 x200"))
            dispatch(sendCommand("x100"))
            dispatch(sendCommand("x50"))
            dispatch(sendCommand("x75"))
            dispatch(sendCommand("x60"))
            dispatch(sendCommand("x10"))
            dispatch(sendCommand("x30"))
            dispatch(sendCommand("x0"))
        }, 10000);
    }, [dispatch]);

    return (
        <WorkScreen title="Command prompt">
            <div className="command-prompt">
                <CommandPreview/>
                <div>dupa</div>
            </div>
        </WorkScreen>
    );
}
