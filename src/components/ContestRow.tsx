import { motion } from "framer-motion";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { genre, genreMatching, getFirestoreContest } from "../type";

interface contestRowProps {
  data: getFirestoreContest;
  widthSize: number;
}

const ContestRow: React.FC<contestRowProps> = ({ data, widthSize }) => {
  const navigator = useNavigate();

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      onClick={() => {
        navigator(`/contest/${data.contestDocID}`);
      }}
      style={{ maxWidth: "500px" }}
      className="relative w-full h-full"
    >
      <motion.div className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-5">
        <div className="mb-3 flex items-center justify-between GalaxyS20Ultra:flex-col">
          <span className="w-3/5 overflow-hidden block whitespace-nowrap text-ellipsis text-xl font-black GalaxyS20Ultra:text-sm">
            {data.title}
          </span>
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm font-black GalaxyS20Ultra:text-xs">
              {genreMatching[data.genre as genre]}
            </span>
            <span style={{ fontSize: "0.7rem" }}>
              {Object.keys(data.writings)
                ? Object.keys(data.writings).length
                : 0}{" "}
              명 참가
            </span>
          </div>
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
