import React, { memo } from "react";


/// Intro Header
const IntroHeader = () => {
    return (
        <header className="font-noto select-none flex w-full items-center justify-between px-20 GalaxyS20Ultra:px-10 GalaxyS20Ultra:my-5">
            {/* logo */}
            <img

                className="h-28 cursor-pointer GalaxyS20Ultra:h-16"
                src="/logo/Ollim-logos_transparent.png"
                alt="header logo"
            />
        </header>
    );
};

export default memo(IntroHeader);
