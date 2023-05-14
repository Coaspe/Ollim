import CalendarSkeleton from "./CalendarSkeleton";
import MypageWritingSkeleton from "./MypageWritingSkeleton";

interface props {
  widthSize: number;
}
const MypageSkeleton: React.FC<props> = ({ widthSize }) => {
  return (
    <div className="relative w-full h-full font-noto bg-opacity-30">
      <div className="w-full flex">
        {/* Profile div */}
        <div className="w-full flex flex-col items-center justify-between">
          {/* Profile Image */}
          <div className="rounded-full w-64 h-64 shadow-xl bg-gray-400 animate-pulse" />

          {/* Username */}
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold my-7 mr-3 rounded-xl text-gray-400 bg-gray-400 animate-pulse">
              ㅇㅇㅇㅇㅇㅇ
            </span>
            <button className="px-2 py-1 rounded-xl text-xs font-Nanum_Gothic font-bold bg-gray-400 text-gray-400 animate-pulse mr-2">
              ㅇㅇㅇ
            </button>
            <svg
              className="w-7 cursor-pointer"
              x="0px"
              y="0px"
              viewBox="0 0 490.3 490.3"
            >
              <g>
                <g>
                  <path
                    d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
                                            s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
                                            c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
                                            C27.9,58.95,0,86.75,0,121.05z"
                  />
                  <path
                    d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
                                            c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
                                            C380.6,325.15,380.6,332.95,385.4,337.65z"
                  />
                </g>
              </g>
            </svg>
          </div>

          {/* Posts, Followers, Followings */}
          {
            <div className="flex w-full items-center justify-center text-sm">
              <div className="flex flex-col items-center rounded-xl justify-center bg-gray-400 animate-pulse">
                <span className="font-bold text-gray-400 font-Nanum_Gothic">
                  000
                </span>
                <span className="text-gray-400">글</span>
              </div>
              <div className="flex flex-col items-center rounded-xl justify-center mx-5 cursor-pointer bg-gray-400 animate-pulse">
                <span className="font-bold text-gray-400 font-Nanum_Gothic">
                  0
                </span>
                <span className="text-gray-400">ㅇㅇㅇ</span>
              </div>
              <div className="flex flex-col items-center rounded-xl justify-center cursor-pointer bg-gray-400 animate-pulse">
                <span className="font-bold text-gray-400 font-Nanum_Gothic">
                  0
                </span>
                <span className="text-gray-400">ㅇㅇㅇ</span>
              </div>
            </div>
          }
          <div className="flex w-full items-center justify-center my-10 space-x-5">
            {widthSize > 500 && (
              <button className="px-4 py-3 rounded-2xl text-gray-400 bg-gray-400 animate-pulse shadow-md font-semibold">
                새 작품 추가
              </button>
            )}
            <button className="px-4 py-3 rounded-2xl text-gray-400 bg-gray-400 animate-pulse shadow-md font-semibold">
              백일장 개최
            </button>
            {/* <button className="px-4 py-3 rounded-2xl text-gray-400 bg-gray-400 animate-pulse shadow-md font-semibold">
              다른 작가의 작품보기
            </button> */}
          </div>

          {/* Calendar */}
          <CalendarSkeleton widthSize={widthSize} />

          {/* On writing */}
          <div className="flex px-5 py-5 items-center flex-col my-20 w-2/3 GalaxyS20Ultra:my-10">
            <div className="w-full grid grid-cols-3 items-center mb-10 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:space-y-10">
              <span className="text-2xl font-bold justify-center col-start-2 w-full text-center">
                작가의 글
              </span>
              <div className="flex items-center place-self-end col-start-3 gap-4 text-sm GalaxyS20Ultra:w-full GalaxyS20Ultra:justify-center">
                <span
                  style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                  className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor}`}
                >
                  menu_book
                </span>
                <span
                  style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                  className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor`}
                >
                  history_edu
                </span>
                <span
                  style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                  className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor`}
                >
                  adf_scanner
                </span>
                <span
                  style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                  className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor`}
                >
                  clear_all
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 items-center justify-between w-full gap-5 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:overflow-y-scroll GalaxyS20Ultra:max-h-72 GalaxyS20Ultra:py-5 GalaxyS20Ultra:px-3">
              {Array.from({ length: 3 }, () => 0).map((v, idx) => (
                <MypageWritingSkeleton key={`${idx}_mypagewriting`} />
              ))}
            </div>

            {/* Contest */}
            {/* <div className="w-full grid grid-cols-3 items-center my-10 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:space-y-10">
              <span className="text-2xl font-bold justify-center col-start-2 w-full text-center">
                올림 백일장
              </span>
              <div className="flex items-center place-self-end col-start-3 text-sm GalaxyS20Ultra:w-full GalaxyS20Ultra:justify-center"></div>
            </div>
            <div className="grid grid-cols-3 items-center justify-between w-full gap-5 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:overflow-y-scroll GalaxyS20Ultra:max-h-72 GalaxyS20Ultra:py-5 GalaxyS20Ultra:px-3">
              {Array.from({ length: 3 }, () => 0).map((v, idx) => (
                <MypageWritingSkeleton key={`${idx}_contest`} />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MypageSkeleton;
