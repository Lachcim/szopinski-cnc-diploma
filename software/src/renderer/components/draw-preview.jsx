import React from "react";
import { useSelector } from "react-redux";
import "style/draw-preview";

export default function DrawPreview({ history, activeIndex }) {
    const position = useSelector(state => state.machineState?.machinePos);
    const config = useSelector(state => state.config);

    //margin for workarea preview box
    const X_MARGIN = 2;
    const Y_MARGIN = 2;

    //svg generators for different types of strokes
    const getRapidSVG = (stroke) => {

    };
    const getLinearSVG = (stroke) => {
        return (
            <path
                d={`M ${stroke.from.x + X_MARGIN} ${stroke.from.y + Y_MARGIN}
                    L ${stroke.to.x + X_MARGIN} ${stroke.to.y + Y_MARGIN}`}
            />
        );
    };
    const getArcSVG = (stroke) => {

    };

    //generate svg representing the current stroke and all previous strokes
    const getSVG = () => {
        const output = [];
        const typeHandlers = {
            rapid: getRapidSVG,
            linear: getLinearSVG,
            arc: getArcSVG
        };

        //no strokes yet
        if (activeIndex == null)
            return output;

        for (let i = 0; i <= activeIndex; i++) {
            const stroke = history[i];
            const rawSVG = typeHandlers[stroke.type](stroke);

            output.push(React.cloneElement(rawSVG, {
                stroke: i == activeIndex ? "#1565C0" : undefined,
                vectorEffect: "non-scaling-stroke",
                key: i
            }));
        }

        return output;
    };

    //tool position
    const x = (position?.x ?? 0) / config.unitsPerMm;
    const y = (position?.y ?? 0) / config.unitsPerMm;
    const z = (position?.z ?? 0) / config.unitsPerMmZ;

    //SVG view box size representing the workspace + a constant margin
    const viewBoxWidth = config.workspaceWidth + X_MARGIN * 2;
    const viewBoxHeight = config.workspaceHeight + Y_MARGIN * 2;
    const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

    return (
        <div className="draw-preview">
            <svg viewBox={viewBox}>
                <g
                    stroke="#BDBDBD"
                    strokeWidth="0.25mm"
                >
                    { getSVG() }
                </g>
                <path
                    stroke="#E53935"
                    strokeWidth="1mm"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    d="M 0 0 l 0.001, 0"
                    transform={`translate(${x + 2} ${y + 2})`}
                    style={{ transition: "transform 1s linear" }}
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
