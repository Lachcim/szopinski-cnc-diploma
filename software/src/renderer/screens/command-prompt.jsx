import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import DrawScreen from "renderer/components/draw-screen";
import DrawPreview from "renderer/components/draw-preview";
import CNCSender from "renderer/cnc/cnc-sender";

export default function CommandPrompt() {
    const { current: history } = useRef([]);

    const cncSender = useRef();
    const [initializing, setInitializing] = useState(false);
    const [delta, setDelta] = useState(null);

    const machineBusy = useSelector(state => state.machineState?.busy);

    useEffect(() => {
        cncSender.current = new CNCSender();
        cncSender.current.onInitialBusyCleared = () => setInitializing(false);
        cncSender.current.onDeltaChange = setDelta;

        if (cncSender.current.initialBusy)
            setInitializing(true);

        setTimeout(() => cncSender.current.enqueue(["x50 y150"]), 5000);
        setTimeout(() => cncSender.current.enqueue(["x0 y0"]), 10000);

        return () => cncSender.current.disconnect();
    }, []);

    return (
        <DrawScreen
            drawPreview={
                <DrawPreview
                    history={history}
                    active={machineBusy && !initializing}
                />
            }
        >
            { delta }
        </DrawScreen>
    );
}
