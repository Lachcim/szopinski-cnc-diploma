import React, { useState } from "react";
import "style/command-input";

export default function CommandInput({ onSubmit }) {
    const [value, setValue] = useState("");

    const handleKeyDown = event => {
        //handle enter key without shift key
        if (event.key != "Enter" || event.shiftKey)
            return;

        //submit all input commands
        for (const subcommand of value.split(/[\r\n]+/))
            onSubmit(subcommand);

        //clear input
        setValue("");
        event.preventDefault();
    };

    const rowCount = Math.min((value.match(/[\r\n]+/g) ?? []).length + 1, 5);

    return (
        <textarea
            className="command-input"
            value={value}
            autoFocus
            onChange={event => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={rowCount}
        />
    );
}
