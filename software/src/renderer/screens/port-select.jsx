import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SerialPort } from "serialport";

import Loader from "renderer/components/loader";
import LargeButton from "renderer/components/large-button";
import { VscDebugDisconnect, VscPlug } from "react-icons/vsc";

import { requestConnection } from "renderer/cnc/state";

export default function PortSelect() {
    const [ports, setPorts] = useState([]);
    const [success, setSuccess] = useState(null);
    const connectionStatus = useSelector(state => state.connection.status);
    const dispatch = useDispatch();

    const fetchPorts = () => {
        //obtain list of serial ports and update state
        SerialPort.list()
            .then(newPorts => {
                setPorts(newPorts);
                setSuccess(true);
            })
            .catch(() => setSuccess(false));
    };

    useEffect(() => {
        //query ports on first render
        fetchPorts();

        //repeat serial port query every second, clear on cleanup
        const queryInterval = setInterval(fetchPorts, 1000);
        return () => clearInterval(queryInterval);
    }, []);

    const getOptionList = () => {
        if (success == null)
            return (<p className="placeholder">Loading...</p>);

        if (ports.length == 0)
            return (
                <p className="placeholder">
                    {
                        success ? "There are no available ports"
                            : "Failed to load available ports"
                    }
                </p>
            );

        return ports.map(port => (
            <LargeButton
                icon={<VscPlug/>}
                title={port.path}
                onClick={() => dispatch(requestConnection(port.path))}
                key={port.path}
            />
        ));
    };

    return (
        <div className="micro-screen">
            <h1>
                <VscDebugDisconnect/>
                Select a serial port
            </h1>
            <p>
                Please select a serial port to open. The selected port
                will be used to establish a connection to the CNC machine.
            </p>
            <div className="option-list">
                { getOptionList() }
            </div>
            {
                connectionStatus == "connecting" &&
                <Loader text="Connecting..."/>
            }
        </div>
    );
}
