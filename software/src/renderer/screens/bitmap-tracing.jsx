import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import "style/bitmap-tracing";

import WorkScreen from "renderer/components/work-screen";
import Dropzone from "renderer/components/dropzone";
import CommandPreview from "renderer/components/command-preview";
import LinkButton from "renderer/components/link-button";

import { traceBitmap } from "renderer/cnc/trace";
import { sendCommand, clearHistory } from "renderer/cnc/store";

export default function BitmapTracing() {
    const commandHistory = useSelector(state => state.commandHistory);
    const [file, setFile] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const performTrace = async () => {
            const canvas = await traceBitmap(file);
            canvasRef.current.width = canvas.width;
            canvasRef.current.height = canvas.height;
            canvasRef.current.getContext("2d").putImageData(
                canvas.getContext("2d").getImageData(
                    0, 0,
                    canvas.width,
                    canvas.height
                ),
                0, 0
            );
        };

        if (file)
            performTrace();
    }, [file]);

    return (
        <WorkScreen title="Bitmap tracing">
            <div className="bitmap-tracing">
                {
                    file ? (
                        <>
                            <canvas ref={canvasRef} style={{ border: "1px solid black" }}/>
                        </>
                    ) : (
                        <Dropzone onSubmit={setFile}/>
                    )
                }
            </div>
        </WorkScreen>
    );
}
