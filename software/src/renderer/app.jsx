import React from "react";
import { useRoutes } from "react-router-dom";
import "../style.scss";

import StatusBar from "renderer/components/status-bar";
import FadeScreen from "renderer/components/fade-screen";

import PortSelect from "renderer/screens/port-select";
import WorkflowSelect from "renderer/screens/workflow-select";

export default function App() {
    const currentScreen = useRoutes([
        { path: "/portSelect", element: <PortSelect /> },
        { path: "/workflowSelect", element: <WorkflowSelect /> },
    ]);

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
