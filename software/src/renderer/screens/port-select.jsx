import React from "react";
import LargeButton from "../components/large-button";
import { VscDebugDisconnect, VscPlug } from "react-icons/vsc";

export default function PortSelect({ onSelect }) {
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
                <LargeButton onClick={() => onSelect("COM3")}>
                    <VscPlug/>
                    COM3
                </LargeButton>
                <LargeButton onClick={() => onSelect("/dev/tty0")}>
                    <VscPlug/>
                    /dev/tty0
                </LargeButton>
            </div>
        </div>
    );
}
