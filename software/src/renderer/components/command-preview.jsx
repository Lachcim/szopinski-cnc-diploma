import React from "react";
import { useSelector } from "react-redux";

import "style/command-preview";

export default function CommandPreview() {
    const commands = useSelector(state => state.commandHistory);

    return (
        <ul className="command-preview">
            {
                commands.map((command, index) => (
                    <li
                        key={index}
                        className={`command ${command.status}`}
                    >
                        <p className="status">{ command.status }</p>
                        { command.text }
                    </li>
                ))
            }
        </ul>
    );
}
