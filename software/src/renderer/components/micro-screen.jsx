import React from "react";
import "style/micro-screen";

export default function MicroScreen({ children }) {
    return (
        <div className="micro-screen">{ children }</div>
    );
}
