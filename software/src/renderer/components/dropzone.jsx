import React from "react";
import "style/dropzone";

import { VscFile } from "react-icons/vsc";

export default function Dropzone({ onSubmit }) {
    const handleInputChange = event => {
        if (event.target.files[0])
            onSubmit(event.target.files[0]);
    };

    return (
        <label className="dropzone">
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
