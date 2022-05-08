import React from "react";
import "style/link-button";

export default function LinkButton(props) {
    return (
        <button
            className="link-button"
            {...props}
        >
            choose a different machine
        </button>
    );
}
