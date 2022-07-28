import React from "react";
import "style/link-button";

export default function LinkButton({ children, props }) {
    return (
        <button
            className="link-button"
            {...props}
        >
            { children }
        </button>
    );
}
