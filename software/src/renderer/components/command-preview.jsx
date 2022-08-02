import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import "style/command-preview";

import { clearHistory } from "renderer/cnc/store";
import Tooltip from "renderer/components/tooltip";
import { ERROR_MESSAGES } from "renderer/cnc/config.js";
export default function CommandPreview() {
    const commands = useSelector(state => state.commandHistory);
    const dispatch = useDispatch();
    const listRef = useRef(null);

    //clear command history when the screen is first loaded
    useEffect(() => { dispatch(clearHistory()); }, [dispatch]);

    //detect new executing node
    const executingIndex = commands.findIndex(command => command.status == "executing");

    //scroll new executing node into view
    useLayoutEffect(() => {
        if (executingIndex != -1) {
            listRef.current?.querySelector("li.executing")?.scrollIntoView({
                block: "center"
            });
        }
    }, [executingIndex]);

    //scroll newly typed command into view
    useLayoutEffect(() => {
        listRef.current?.querySelector("li:last-child")?.scrollIntoView();
    }, [commands.length]);

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
