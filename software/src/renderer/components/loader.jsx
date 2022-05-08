import React from "react";
import "style/loader";
import { AiOutlineLoading } from "react-icons/ai";

export default function Loader({ text }) {
    return (
        <div className="loader">
            <div>
                <div className="spinner">
                    <AiOutlineLoading/>
                </div>
                <p className="text">{ text ?? "Loading..." }</p>
            </div>
        </div>
    );
}
