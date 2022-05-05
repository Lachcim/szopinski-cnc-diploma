import React, { useEffect, useState } from "react";
import "../style.scss";

import StatusBar from "./components/status-bar";
import FadeScreen from "./components/fade-screen";

export default function App() {
    const [screenContent, setScreenContent] = useState("dupa");

    useEffect(() => {
        setTimeout(() => setScreenContent("trupa"), 1000);
    }, []);

    return (
        <>
            <StatusBar/>
            <main className="main-content">
                <FadeScreen>
                    {screenContent}
                </FadeScreen>
            </main>
        </>
    );
}
