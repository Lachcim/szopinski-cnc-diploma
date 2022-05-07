import React, { useState } from "react";
import "../style.scss";

import StatusBar from "renderer/components/status-bar";
import FadeScreen from "renderer/components/fade-screen";

import PortSelect from "renderer/screens/port-select";

export default function App() {
    const [currentScreen, setCurrentScreen] = useState(<PortSelect onSelect={() => setCurrentScreen(<PortSelect/>)}/>);

    return (
        <>
            <StatusBar/>
            <main className="main-content">
                <FadeScreen>
                    { currentScreen }
                </FadeScreen>
            </main>
        </>
    );
}
