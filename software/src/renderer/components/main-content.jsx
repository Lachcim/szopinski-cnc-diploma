import React from "react";
import "style/main-content";

export default function MainContent({ children }) {
    return (
        <main className="main-content">{ children }</main>
    );
}
