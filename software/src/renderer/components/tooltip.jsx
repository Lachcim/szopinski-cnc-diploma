import React from "react";
import "style/tooltip";

export default function Tooltip({ align, children }) {
    const alignClass = align == "right" ? "align-right" : "align-left";

    return (
        <p className={`tooltip ${alignClass}`}>
            { children }
        </p>
    );
}
