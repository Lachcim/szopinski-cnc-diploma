import React from "react";

import { VscWarning } from "react-icons/vsc";

export default function Modal({ title, children, onClose }) {
    return (
        <div className="modal">
            <div className="window">
                <div className="title">
                    <VscWarning />
                    { title }
                </div>
                <div className="content">
                    { children }
                    <div className="close">
                        <button onClick={onClose}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
