import React, { useEffect, useState } from "react";
import "style/slide-screen";

export default function SlideScreen({ screenKey, children }) {
    const [stableScreenKey, setStableScreenKey] = useState(screenKey);
    const [stableChildren, setStableChildren] = useState(children);
    const [animation, setAnimation] = useState(null);

    useEffect(() => {
        if (screenKey == stableScreenKey) {
            //update stable children if key hasn't changed
            setStableChildren(children);
        }
        else {
            //begin transition if key changed
            setAnimation("slide-out");
        }
    }, [screenKey, stableScreenKey, children, setStableChildren, setAnimation]);

    const handleAnimationEnd = () => {
        //disable animation once stabilized
        if (screenKey == stableScreenKey) {
            setAnimation(null);
            return;
        }

        //stabilize once slid out
        setTimeout(() => setAnimation("slide-in"), 0);
        setStableScreenKey(screenKey);
        setStableChildren(children);
    };

    return (
        <div
            className="slide-screen"
            style={{
                animationName: animation,
                opacity: animation == "slide-out" ? 0 : 1
            }}
            onAnimationEnd={handleAnimationEnd}
        >
            { stableChildren }
        </div>
    );
}
