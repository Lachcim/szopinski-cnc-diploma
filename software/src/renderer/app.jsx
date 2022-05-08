import React, { useState, useEffect } from "react";
import { useRoutes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../style.scss";

import StatusBar from "renderer/components/status-bar";

import PortSelect from "renderer/screens/port-select";
import WorkflowSelect from "renderer/screens/workflow-select";
import ConnectionErrorModal from "./components/connection-error-modal";

export default function App() {
    const navigate = useNavigate();
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
    }, [connection.status, connection.error]);

    return (
        <>
            <StatusBar/>
            <main className="main-content">
                { currentScreen }
            </main>
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
