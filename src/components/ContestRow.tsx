import { motion } from "framer-motion";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { genre, getFirestoreContest } from "../type";

interface contestRowProps {
  data: getFirestoreContest;
  widthSize: number;
}
const ContestRow: React.FC<contestRowProps> = ({ data, widthSize }) => {
  const gerneType = {
    SCENARIO: "시나리오",
    POEM: "시",
    NOVEL: "소설",
  };

  const navigator = useNavigate();

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      onClick={() => {
        navigator(`/contest/${data.contestDocID}`);
      }}
      className="relative w-full h-full"
    >
      <motion.div className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-5 z-0">
        <div className="mb-3 flex items-center justify-between GalaxyS20Ultra:flex-col">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-black">
              {data.title.length > 9
                ? `${data.title.slice(0, 10)} ...`
                : data.title}
            </span>
            <span className="font-bold text-lg">·</span>
            <span className="text-sm text-gray-700 font-black">
              {gerneType[data.genre as genre]}
            </span>
          </div>
          <span style={{ fontSize: "0.7rem" }} className="text-gray-400">
            {Object.keys(data.writings) ? Object.keys(data.writings).length : 0}{" "}
            명 참가
          </span>
        </div>
        {widthSize > 500 && (
          <motion.textarea
            layoutId="textarea"
            value={data.description}
            readOnly
            className="text-sm text-gray-400 mb-3 font-semibold bg-transparent resize-none overflow-hidden pointer-events-none"
          >
            {data.description}
          </motion.textarea>
        )}
      </motion.div>
    </motion.div>
  );
};

export default memo(ContestRow);
