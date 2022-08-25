import React from "react";
import { useSelector } from "react-redux";
import {
    UNITS_PER_MM,
    UNITS_PER_MM_Z,
    WORKSPACE_WIDTH_MM,
    WORKSPACE_HEIGHT_MM
} from "renderer/cnc/config";
import "style/draw-preview";

//margin for workarea preview box
const X_MARGIN = 5;
const Y_MARGIN = 5;

function visualizeStroke(command, index) {
    //not drawn yet
    if (command.status != "done" && command.status != "executing")
        return;

    //not a stroke
    if (command.error || command.stroke.type == null)
        return;

    const active = command.status == "executing" ? "active" : "";

    if (command.stroke.type == "rapid") {
        const deltaX = command.stroke.destination.x - command.stroke.origin.x;
        const deltaY = command.stroke.destination.y - command.stroke.origin.y;

        if (deltaX == 0 || deltaY == 0 || Math.abs(deltaX) == Math.abs(deltaY)) {
            return (
                <line
                    key={index}
                    className={`rapid ${active}`}
                    vectorEffect="non-scaling-stroke"
                    x1={command.stroke.origin.x / UNITS_PER_MM}
                    y1={command.stroke.origin.y / UNITS_PER_MM}
                    x2={command.stroke.destination.x / UNITS_PER_MM}
                    y2={command.stroke.destination.y / UNITS_PER_MM}
                />
            );
        }

        const diagonalDelta = Math.min(Math.abs(deltaX), Math.abs(deltaY));
        const diagonalDeltaX = diagonalDelta * Math.sign(deltaX);
        const diagonalDeltaY = diagonalDelta * Math.sign(deltaY);

        return (
            <React.Fragment key={index}>
                <line
                    className={`rapid ${active}`}
                    vectorEffect="non-scaling-stroke"
                    x1={command.stroke.origin.x / UNITS_PER_MM}
                    y1={command.stroke.origin.y / UNITS_PER_MM}
                    x2={(command.stroke.origin.x + diagonalDeltaX) / UNITS_PER_MM}
                    y2={(command.stroke.origin.y + diagonalDeltaY) / UNITS_PER_MM}
                />
                <line
                    className={`rapid ${active}`}
                    vectorEffect="non-scaling-stroke"
                    x1={(command.stroke.origin.x + diagonalDeltaX) / UNITS_PER_MM}
                    y1={(command.stroke.origin.y + diagonalDeltaY) / UNITS_PER_MM}
                    x2={command.stroke.destination.x / UNITS_PER_MM}
                    y2={command.stroke.destination.y / UNITS_PER_MM}

                />
            </React.Fragment>
        );
    }

    if (command.stroke.type == "linear")
        return (
            <line
                key={index}
                className={active}
                vectorEffect="non-scaling-stroke"
                x1={command.stroke.origin.x / UNITS_PER_MM}
                y1={command.stroke.origin.y / UNITS_PER_MM}
                x2={command.stroke.destination.x / UNITS_PER_MM}
                y2={command.stroke.destination.y / UNITS_PER_MM}
            />
        );

    if (command.stroke.type == "arc" || command.stroke.type == "ccwArc") {
        const originDiffX = (command.stroke.origin.x - command.stroke.center.x) / UNITS_PER_MM;
        const originDiffY = (command.stroke.origin.y - command.stroke.center.y) / UNITS_PER_MM;
        const destDiffX = (command.stroke.destination.x - command.stroke.center.x) / UNITS_PER_MM;
        const destDiffY = (command.stroke.destination.y - command.stroke.center.y) / UNITS_PER_MM;
        const radius = Math.sqrt(destDiffX ** 2 + destDiffY ** 2);

        if (command.stroke.origin.x == command.stroke.destination.x
            && command.stroke.origin.y == command.stroke.destination.y)
            return (
                <circle
                    key={index}
                    className={active}
                    vectorEffect="non-scaling-stroke"
                    cx={command.stroke.center.x / UNITS_PER_MM}
                    cy={command.stroke.center.y / UNITS_PER_MM}
                    r={radius}
                />
            );

        const originAngle = Math.atan2(originDiffY, originDiffX);
        const destAngle = Math.atan2(destDiffY, destDiffX);

        const getArcAngle = () => {
            if (command.stroke.type == "arc") {
                if (originAngle < destAngle) return destAngle - originAngle;
                else return 2 * Math.PI - originAngle + destAngle;
            }
            else {
                if (originAngle < destAngle) return 2 * Math.PI - destAngle + originAngle;
                else return originAngle - destAngle;
            }
        };

        return (
            <path
                key={index}
                className={active}
                vectorEffect="non-scaling-stroke"
                d={`
                    M
                    ${command.stroke.origin.x / UNITS_PER_MM}
                    ${command.stroke.origin.y / UNITS_PER_MM}
                    A
                    ${radius} ${radius} 0
                    ${getArcAngle() > Math.PI ? 1 : 0}
                    ${command.stroke.type == "arc" ? 1 : 0}
                    ${command.stroke.destination.x / UNITS_PER_MM}
                    ${command.stroke.destination.y / UNITS_PER_MM}
                `}
            />
        );
    }
}

export default function DrawPreview() {
    const position = useSelector(state => state.machineState?.position);
    const commands = useSelector(state => state.commandHistory);

    //tool position
    const x = (position?.x ?? 0) / UNITS_PER_MM;
    const y = (position?.y ?? 0) / UNITS_PER_MM;
    const z = (position?.z ?? 0) / UNITS_PER_MM_Z;

    //SVG view box size representing the workspace + a constant margin
    const viewBoxWidth = WORKSPACE_WIDTH_MM + X_MARGIN * 2;
    const viewBoxHeight = WORKSPACE_HEIGHT_MM + Y_MARGIN * 2;
    const viewBox = `${-X_MARGIN} ${-Y_MARGIN} ${viewBoxWidth} ${viewBoxHeight}`;

    return (
        <div className="draw-preview">
            <svg viewBox={viewBox}>
                <g className="strokes">
                    { commands.map(visualizeStroke) }
                </g>
                <path
                    className="tool-tracker"
                    vectorEffect="non-scaling-stroke"
                    d="M 0 0 l 0.001, 0"
                    transform={`translate(${x} ${y})`}
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
