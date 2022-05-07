import React, { useEffect, useState } from "react";

export default function FadeScreen({ children }) {
    const [stableChildren, setStableChildren] = useState(children);
    const [animation, setAnimation] = useState(null);

    useEffect(() => {
        //start animation if children changed
        if (children != stableChildren)
            setAnimation("fade-out");
    }, [children, stableChildren, setAnimation]);

    const handleAnimationEnd = () => {
        //disable animation once stabilized
        if (children == stableChildren) {
            setAnimation(null);
            return;
        }

        //stabilize once faded out
        setAnimation("fade-in");
        setStableChildren(children);
    };

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
    );
}
