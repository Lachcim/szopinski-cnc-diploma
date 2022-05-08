import React, { useState, useEffect } from "react";
import { useRoutes, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "../style.scss";

import StatusBar from "renderer/components/status-bar";
import SlideScreen from "renderer/components/slide-screen";

import PortSelect from "renderer/screens/port-select";
import WorkflowSelect from "renderer/screens/workflow-select";
import ConnectionErrorModal from "./components/connection-error-modal";

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
    }, [connection.status, connection.error]);

    return (
        <>
            <StatusBar/>
            <main className="main-content">
                <SlideScreen screenKey={location.pathname}>
                    { currentScreen }
                </SlideScreen>
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
