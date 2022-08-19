import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import { useRoutes, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "style/root";

import StatusBar from "renderer/components/status-bar";
import MainContent from "renderer/components/main-content";
import SlideScreen from "renderer/components/slide-screen";

import PortSelect from "renderer/screens/port-select";
import WorkflowSelect from "renderer/screens/workflow-select";
import BatchExecution from "renderer/screens/batch-execution";
import CommandPrompt from "renderer/screens/command-prompt";
import BitmapTracing from "renderer/screens/bitmap-tracing";

import ConnectionErrorModal from "renderer/components/connection-error-modal";

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentScreen = useRoutes([
        { path: "/portSelect", element: <PortSelect/> },
        { path: "/workflowSelect", element: <WorkflowSelect/> },
        { path: "/batchExecution", element: <BatchExecution/> },
        { path: "/commandPrompt", element: <CommandPrompt/> },
        { path: "/bitmapTracing", element: <BitmapTracing/> }
    ]);

    const [displayedError, setDisplayedError] = useState(null);
    const connection = useSelector(state => state.connection);

    useEffect(() => {
        if (connection.status == "disconnected" && connection.error) {
            setDisplayedError(connection.error);
        }

        if (connection.status != "disconnected" || connection.error)
            ipcRenderer.send("set-port", connection.port);
        else
            ipcRenderer.send("set-port", null);
    }, [connection.status, connection.error, connection.port]);

    return (
        <>
            <StatusBar/>
            <MainContent>
                <SlideScreen screenKey={location.pathname}>
                    { currentScreen }
                </SlideScreen>
            </MainContent>
            {
                displayedError &&
                <ConnectionErrorModal
                    error={displayedError}
                    onClose={() => {
                        setDisplayedError(null);
                        navigate("/portSelect");
                    }}
                />
            }
        </>
    );
}
