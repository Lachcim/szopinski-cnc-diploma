import React from "react";
import { useSelector } from "react-redux";
import "style/draw-preview";

export default function DrawPreview({ history, active }) {
    const position = useSelector(state => state.machineState?.machinePos);
    const config = useSelector(state => state.config);

    //margin for workarea preview box
    const X_MARGIN = 5;
    const Y_MARGIN = 5;

    //tool position
    const x = (position?.x ?? 0) / config.unitsPerMm;
    const y = (position?.y ?? 0) / config.unitsPerMm;
    const z = (position?.z ?? 0) / config.unitsPerMmZ;

    //SVG view box size representing the workspace + a constant margin
    const viewBoxWidth = config.workspaceWidth + X_MARGIN * 2;
    const viewBoxHeight = config.workspaceHeight + Y_MARGIN * 2;
    const viewBox = `${-X_MARGIN} ${-Y_MARGIN} ${viewBoxWidth} ${viewBoxHeight}`;

    return (
        <div className="draw-preview">
            <svg viewBox={viewBox}>
                <g strokeWidth="0.25mm">

                </g>
                <path
                    stroke="#E53935"
                    strokeWidth="1mm"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    d="M 0 0 l 0.001, 0"
                    transform={`translate(${x} ${y})`}
                    style={{ transition: "transform 0.1s linear" }}
                />
            </svg>
            <div className="coordinates">
                <p>
                    X: { x.toFixed(2) } mm<br/>
                    Y: { y.toFixed(2) } mm<br/>
                    Z: { z.toFixed(2) } mm
                </p>
            </div>
        </div>
    );
}
