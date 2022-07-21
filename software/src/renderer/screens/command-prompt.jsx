import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueCommands } from "renderer/cnc/state";

import DrawScreen from "renderer/components/draw-screen";
import DrawPreview from "renderer/components/draw-preview";

export default function CommandPrompt() {
    const dispatch = useDispatch();
    const total = useSelector(state => state.totalCommandCounter);

    return (
        <DrawScreen
            drawPreview={
                <DrawPreview
                    history={[]}
                    active={false}
                />
            }
        >

        </DrawScreen>
    );
}
