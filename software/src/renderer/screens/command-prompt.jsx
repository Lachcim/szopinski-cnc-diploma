import React, { useState } from "react";
import DrawScreen from "../components/draw-screen";
import DrawPreview from "../components/draw-preview";

export default function CommandPrompt() {
    const [history, setHistory] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <DrawScreen
            drawPreview={
                <DrawPreview
                    history={history}
                    activeIndex={activeIndex}
                />
            }
        >
            maria
        </DrawScreen>
    );
}
