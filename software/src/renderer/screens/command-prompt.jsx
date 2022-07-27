import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sendCommand } from "renderer/cnc/store";

import DrawScreen from "renderer/components/draw-screen";
import DrawPreview from "renderer/components/draw-preview";

export default function CommandPrompt() {
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => dispatch(sendCommand("x50")), 1000);
        setTimeout(() => dispatch(sendCommand("x100 y50")), 3000);
        setTimeout(() => dispatch(sendCommand("x0 y0")), 5000);
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
