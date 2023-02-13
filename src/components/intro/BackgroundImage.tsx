// import './BackgroundImage.css'
const BackgroundImage = () => {
    return <>
        {/* Background image */}
        <div className="bg-svg z-0 absolute top-0 left-0 w-full h-full opacity-80 GalaxyS20Ultra:invisible">
            <img
                className="w-full h-full fit-cover"
                src="backgroundImage/main.jpg"
                alt="background"
            />
        </div>

        {/* Background image copy right */}
        <div className="absolute right-3 bottom-3">
            <span className="text-slate-300 text-sm">
                Photo by{" "}
                <a href="https://unsplash.com/@patrickian4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                    Patrick Fore
                </a>{" "}
                on{" "}
                <a href="https://unsplash.com/s/photos/writing?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                    Unsplash
                </a>
            </span>
        </div></>
}

export default BackgroundImage;