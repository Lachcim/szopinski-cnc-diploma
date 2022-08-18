import React from "react";
import "style/dropzone";

import { VscFile } from "react-icons/vsc";

export default function Dropzone({ onSubmit }) {
    const handleDrop = event => {
        if (event.dataTransfer.files[0])
            onSubmit(event.dataTransfer.files[0]);
    };
    const handleInputChange = event => {
        if (event.target.files[0])
            onSubmit(event.target.files[0]);
    };

    return (
        <label
            className="dropzone"
            onDragOver={event => event.preventDefault()}
            onDropCapture={handleDrop}
        >
            <div className="drop-here">
                <VscFile/>
                <p>Drop file here</p>
            </div>
            <input
                type="file"
                onChange={handleInputChange}
            />
        </label>
    );
}
