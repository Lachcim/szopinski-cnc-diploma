import React from "react";
import "style/status-bar";
import { useSelector } from "react-redux";

export default function StatusBar() {
    const connection = useSelector(state => state.connection);
    const busy = useSelector(state => state.machineState?.busy);

    const getMachineName = () => {
        if (connection.status == "disconnected") {
            if (connection.error) return connection.port;
            return "Machine not connected";
        }

        return connection.port;
    };
    const getDotTitle = () => {
        const errorDict = {
            "connectionFailed": "connection failed",
            "timedOut": "timed out",
            "malformed": "malformed data"
        };

        if (connection.status == "disconnected") {
            if (connection.error) return `Disconnected: ${errorDict[connection.error]}`;
            return "Disconnected";
        }

        if (connection.status == "connecting")
            return "Connecting";
        if (connection.status == "disconnecting")
            return "Disconnecting";

        if (busy) return "Busy";
        return "Idle";
    };
    const getDotClass = () => {
        if (connection.status == "connected") {
            if (busy) return "busy";
            return "idle";
        }

        if (connection.status == "disconnected")
            return "disconnected";

        return "transition";
    };

    return (
        <header className="status-bar">
            <div className="machine">
                <div className={`status-dot ${getDotClass()}`}>
                    <p className="tooltip">{ getDotTitle() }</p>
                </div>
                { getMachineName() }
            </div>
        </header>
    );
}
