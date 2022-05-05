import React from "react";

export default function LargeButton({icon, title, children, ...props}) {
    return (
        <button
            className="large-button"
            {...props}
        >
            {children}
        </button>
    )
}