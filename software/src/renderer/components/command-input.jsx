import React, { useState } from "react";
import "style/command-input";

import { useDispatch } from "react-redux";
import { sendCommand } from "renderer/cnc/store";

export default function CommandInput() {
    const [value, setValue] = useState("");
    const dispatch = useDispatch();

    const handleKeyDown = event => {
        //handle enter key without shift key
        if (event.key != "Enter" || event.shiftKey)
            return;

        //dispatch all input commands
        for (const subcommand of value.split(/[\r\n]+/))
            dispatch(sendCommand(subcommand));

        //clear input
        setValue("");
        event.preventDefault();
    };

    const rowCount = Math.min((value.match(/[\r\n]+/g) ?? []).length + 1, 5);

    return (
        <textarea
            className="command-input"
            value={value}
            onChange={event => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={rowCount}
        />
    );
}
