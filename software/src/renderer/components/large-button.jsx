import React from "react";

export default function LargeButton({ icon, title, children, ...props }) {
    return (
        <button
            className="large-button"
            {...props}
        >
            { icon }
            <div>
                <header>{ title }</header>
                { children }
            </div>
        </button>
    );
}
