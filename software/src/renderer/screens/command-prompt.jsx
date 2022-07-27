import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendCommand } from "renderer/cnc/store";

import DrawScreen from "renderer/components/draw-screen";
import DrawPreview from "renderer/components/draw-preview";

export default function CommandPrompt() {
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => dispatch(sendCommand("g0 x50")), 1000);
        setTimeout(() => dispatch(sendCommand("x150 y50")), 3000);
        setTimeout(() => dispatch(sendCommand("g1 x0 y0")), 5000);
    }, [dispatch]);

    return (
        <DrawScreen
            drawPreview={
                <DrawPreview
                    history={[]}
                    active={false}
                />
            }
        >
            dupa trupa
        </DrawScreen>
    );
}
