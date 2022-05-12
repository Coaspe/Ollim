const MypageWritingSkeleton = () => {
  return (
    <div
      style={{ maxWidth: "500px" }}
      className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-5 z-0 bg-gray-400 animate-pulse "
    >
      <div className="mb-3 flex items-center justify-between GalaxyS20Ultra:flex-col">
        <span className="w-3/5 overflow-hidden block whitespace-nowrap text-ellipsis text-xl font-black GalaxyS20Ultra:text-sm text-gray-400">
          asda
        </span>
        <div className="flex flex-col items-center text-gray-400">
          <span className="text-sm font-black GalaxyS20Ultra:text-xs">0</span>
          <span style={{ fontSize: "0.7rem" }}>0 좋아요</span>
        </div>
      </div>
      <textarea className="text-sm text-gray-400 mb-3 font-semibold bg-transparent resize-none overflow-hidden pointer-events-none">
        adwad
      </textarea>
    </div>
  );
};

export default MypageWritingSkeleton;
