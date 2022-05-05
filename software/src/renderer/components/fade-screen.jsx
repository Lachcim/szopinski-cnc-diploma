import React, { useEffect, useState } from "react";

export default function FadeScreen({children}) {
    const [stableChildren, setStableChildren] = useState(children);
    const [animation, setAnimation] = useState(null);

    useEffect(() => {
        if (children != stableChildren)
            setAnimation("fade-out");
    }, [children, stableChildren, setAnimation]);

    const handleAnimationEnd = () => {
        if (children == stableChildren) {
            setAnimation(null);
            return;
        }

        setAnimation("fade-in")
        setStableChildren(children);
    }

    return (
        <div
            className="fade-screen"
            style={{
                animationName: animation,
                opacity: animation == "fade-out" ? 0 : 1
            }}
            onAnimationEnd={handleAnimationEnd}
        >
            { stableChildren }
        </div>
    )
}
