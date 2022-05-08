import React from "react";

import Modal from "renderer/components/modal";

export default function ConnectionErrorModal({ error, onClose }) {
    const getMessage = () => {
        if (error == "connectionFailed")
            return "Connection to the serial port failed.";
        if (error == "timedOut")
            return "Connection to the serial port timed out.";
        if (error == "malformed")
            return "Malformed data received.";
    };

    return (
        <Modal
            title="Connection error"
            onClose={onClose}
        >
            <p>{ getMessage() }</p>
            <p>Troubleshooting tips:</p>
            <ul>
                <li>Check if the machine is operating correctly</li>
                <li>Try a different serial port</li>
            </ul>
        </Modal>
    );
}
