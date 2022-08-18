import React from "react";
import "style/dropzone";

import { VscFile } from "react-icons/vsc";

export default function Dropzone({ ref }) {
    return (
        <label className="dropzone">
            <div className="drop-here">
                <VscFile/>
                <p>Drop file here</p>
            </div>
            <input
                type="file"
                ref={ref}
            />
        </label>
    );
}
