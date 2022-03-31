import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { genre, medal } from "../type";
interface props {
  data: any;
  medal: medal;
}
const BestWriting: React.FC<props> = ({ data, medal }) => {
  const gerneType = {
    SCENARIO: "시나리오",
    POEM: "시",
    NOVEL: "소설",
  };
  const navigator = useNavigate();

  return (
    <div
      onClick={() => {
        navigator(`/writings/${data.userUID}/${data.writingUID}`);
      }}
      className="relative w-full h-full"
    >
      <div
        key="container-before"
        className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-3 z-0"
      >
        <div className="mb-3 flex items-center w-full justify-between">
          <div className="flex items-center">
            <span className="text-xl font-black">{data.title}</span>
            <span className="text-sm text-gray-700 font-black ml-3">
              {gerneType[data.genre as genre]}
            </span>
          </div>
          <img className="w-7" src={`/svg/${medal}.svg`} alt={medal} />
        </div>
        <textarea
          value={data.synopsis}
          readOnly
          className="text-sm text-gray-400 mb-3 font-semibold bg-transparent resize-none overflow-hidden pointer-events-none"
        >
          {data.synopsis}
        </textarea>
      </div>
    </div>
  );
};

export default memo(BestWriting);
