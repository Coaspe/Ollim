import { memo } from "react";


const CommitRow = (data, selectedKey, handleCommitChange) => {
    const tmpData = Object.keys(data);
    const key =
        "memo" === tmpData[0] ? tmpData[1] : tmpData[0];
    const date = new Date(parseInt(key)).toLocaleString();
    const DateNight = date.includes("오전") ? "오전" : "오후";
    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                handleCommitChange(selectedKey, data, key)
            }}
            key={key}
            className={`w-full flex items-center justify-center cursor-pointer shadow-lg px-2 py-2 rounded-2xl ${selectedKey === key && "bg-genreSelectedBG"
                } hover:bg-wirtingButtonHover`}
        >
            <div className="flex items-center w-5/6 justify-between">
                <div className="flex flex-col items-center text-sm">
                    <span>{date.split(DateNight)[0]}</span>
                    <span>
                        {`${DateNight} `}
                        {date.split(DateNight)[1]}
                    </span>
                </div>
                <textarea
                    value={data.memo}
                    readOnly
                    className="w-1/2 text-sm resize-none cursor-pointer focus:outline-none bg-transparent"
                >
                    {data.memo}
                </textarea>
            </div>
        </div>
    );
}

export default memo(CommitRow);
