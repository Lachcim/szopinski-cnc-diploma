import React from "react";
import "style/work-screen";

import { VscChevronLeft } from "react-icons/vsc";
import { Link } from "react-router-dom";

import DrawPreview from "renderer/components/draw-preview";

export default function WorkScreen({ title, children }) {
    return (
        <div className="work-screen">
            <header className="title">
                <Link to="/workflowSelect">
                    <VscChevronLeft/>
                </Link>
                { title }
            </header>
            <div className="preview-main">
                <div className="preview">
                    <DrawPreview/>
                </div>
                <div className="work-screen-main">
                    { children }
                </div>
            </div>
        </div>
    );
}
