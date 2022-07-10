import React from "react";
import "style/draw-screen";

export default function DrawScreen({ children, drawPreview }) {
    return (
        <div className="draw-screen">
            <div className="preview">
                { drawPreview }
            </div>
            <div className="screen-main">
                { children }
            </div>
        </div>
    );
}
