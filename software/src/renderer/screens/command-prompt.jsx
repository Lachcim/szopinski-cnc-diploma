import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueCommands } from "renderer/cnc/state";

import DrawScreen from "renderer/components/draw-screen";
import DrawPreview from "renderer/components/draw-preview";

export default function CommandPrompt() {
    const dispatch = useDispatch();
    const total = useSelector(state => state.totalCommandCounter);

    useEffect(() => {
        setTimeout(() => dispatch(enqueueCommands(["x200 y50", "x0 y100"])), 5000);
        setTimeout(() => dispatch(enqueueCommands(["x0 y0"])), 10000);
    }, []);

    return (
        <DrawScreen
            drawPreview={
                <DrawPreview
                    history={[]}
                    active={false}
                />
            }
        >
            { total }
        </DrawScreen>
    );
}
