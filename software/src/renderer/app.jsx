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
import ConnectionErrorModal from "renderer/components/connection-error-modal";

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentScreen = useRoutes([
        { path: "/portSelect", element: <PortSelect /> },
        { path: "/workflowSelect", element: <WorkflowSelect /> },
    ]);

    const [displayedError, setDisplayedError] = useState(null);
    const connection = useSelector(state => state.connection);

    useEffect(() => {
        if (connection.status == "disconnected" && connection.error) {
            setDisplayedError(connection.error);
        }

        const displayedPort = (
            connection.status != "disconnected" || connection.error
        ) && connection.port;

        ipcRenderer.send("set-port", displayedPort);
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
