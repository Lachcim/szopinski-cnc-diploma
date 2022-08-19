import React, { useLayoutEffect, useRef } from "react";

import "style/command-preview";

import Tooltip from "renderer/components/tooltip";
import { ERROR_MESSAGES } from "renderer/cnc/config.js";

export default function CommandPreview({ commands }) {
    const listRef = useRef(null);

    //detect new executing node
    const previewMode = commands.every(command => command.status == "preview");
    const executingIndex = commands.findIndex(command => command.status == "executing");

    //scroll new executing node into view
    useLayoutEffect(() => {
        if (executingIndex != -1 && !previewMode) {
            listRef.current?.querySelector("li.executing")?.scrollIntoView({
                block: "center"
            });
        }
    }, [executingIndex, previewMode]);

    //scroll newly typed command into view
    useLayoutEffect(() => {
        if (!previewMode)
            listRef.current?.querySelector("li:last-child")?.scrollIntoView();
    }, [commands.length, previewMode]);

    //scroll to top when preview mode begins
    useLayoutEffect(() => {
        if (previewMode)
            listRef.current?.querySelector("li")?.scrollIntoView();
    }, [previewMode]);

    return (
        <ul
            className="command-preview"
            ref={listRef}
        >
            {
                commands.map((command, index) => {
                    const status = command.error == null ? command.status : "error";

                    return (
                        <li
                            key={index}
                            className={`command ${status}`}
                        >
                            <div className="status">
                                <p>{ status != "preview" ? status : "unsent" }</p>
                                {
                                    command.error &&
                                    <Tooltip align="right">
                                        { ERROR_MESSAGES[command.error] }
                                    </Tooltip>
                                }
                            </div>
                            <p className="command-text">
                                { command.text }
                            </p>
                        </li>
                    );
                })
            }
        </ul>
    );
}
