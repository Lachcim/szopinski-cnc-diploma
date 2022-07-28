import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendCommand } from "renderer/cnc/store";

import WorkScreen from "renderer/components/work-screen";

export default function CommandPrompt() {
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => dispatch(sendCommand("g0 x50")), 1000);
        setTimeout(() => dispatch(sendCommand("x150 y50")), 3000);
        setTimeout(() => dispatch(sendCommand("g1 x0 y0")), 5000);
    }, [dispatch]);

    return (
        <WorkScreen title="Command prompt">
            dupa trupa
        </WorkScreen>
    );
}
