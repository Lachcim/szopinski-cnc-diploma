import React from "react";
import { useSelector } from "react-redux";

import "style/command-preview";

import Tooltip from "renderer/components/tooltip";
import { ERROR_MESSAGES } from "renderer/cnc/config.js";

export default function CommandPreview() {
    const commands = useSelector(state => state.commandHistory);

    return (
        <ul className="command-preview">
            {
                commands.map((command, index) => {
                    const status = command.error == null ? command.status : "error";

                    return (
                        <li
                            key={index}
                            className={`command ${status}`}
                        >
                            <div className="status">
                                <p>{ status }</p>
                                {
                                    command.error &&
                                    <Tooltip align="right">
                                        { ERROR_MESSAGES[command.error] }
                                    </Tooltip>
                                }
                            </div>
                            { command.text }
                        </li>
                    );
                })
            }
        </ul>
    );
}
