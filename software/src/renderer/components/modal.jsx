import React, { useState } from "react";
import "style/modal";

import { VscWarning } from "react-icons/vsc";

export default function Modal({ title, children, onClose }) {
    const [animation, setAnimation] = useState("fade-in");

    const handleAnimationEnd = () => {
        if (animation == "fade-out")
            onClose();
    };

    return (
        <div
            className="modal"
            style={{
                animationName: animation,
                opacity: animation == "fade-out" ? 0 : 1
            }}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="window">
                <div className="title">
                    <VscWarning />
                    { title }
                </div>
                <div className="content">
                    { children }
                    <div className="close">
                        <button onClick={() => setAnimation("fade-out")}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
