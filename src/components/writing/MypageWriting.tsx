import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { genreMatching } from "../../constants";
import { genre, getFirestoreWriting } from "../../type";
interface props {
  data: getFirestoreWriting;
  medal?: string;
  widthSize: number;
}
const MypageWriting: React.FC<props> = ({ data, widthSize }) => {
  const [hoverExpandDetail, setHoverExpandDetail] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [infoVisible, setInfoVisible] = useState(false);
  const navigator = useNavigate();

  return (
    <motion.div
      layout
      animate={{ opacity: [0, 1] }}
      onClick={() => {
        // Prevents memory leak
        timer && clearTimeout(timer);
        navigator(`/writings/${data.userUID}/${data.writingDocID}`);
      }}
      onHoverStart={() => {
        setTimer(
          setTimeout(() => {
            setHoverExpandDetail(true);
          }, 1000)
        );
        setInfoVisible(true);
      }}
      onHoverEnd={() => {
        setHoverExpandDetail(false);
        setInfoVisible(false);
        timer && clearTimeout(timer);
      }}
      style={{ maxWidth: "500px" }}
      className="relative w-full h-full"
    >
      <AnimateSharedLayout>
        <motion.div
          whileHover={{ y: "-10%" }}
          key="container-before"
          layoutId="container"
          className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-5 z-0"
        >
          {infoVisible && (
            <span className="absolute bg-gray-800 text-white top-1 right-1 text-xs rounded-lg px-2 py-1 font-Nanum_Gothic">
              기다려서 세부사항을 확인하기
            </span>
          )}
          <div className="mb-3 flex items-center justify-between GalaxyS20Ultra:flex-col">
            <span className="w-3/5 overflow-hidden block whitespace-nowrap text-ellipsis text-xl font-black GalaxyS20Ultra:text-sm">
              {data.title}
            </span>
            <div className="flex flex-col items-center text-gray-400">
              <span className="text-sm font-black GalaxyS20Ultra:text-xs">
                {genreMatching[data.genre as genre]}
              </span>
              <span style={{ fontSize: "0.7rem" }}>
                {data.likes.size} 좋아요
              </span>
            </div>
          </div>
          {widthSize > 500 && (
            <motion.textarea
              layoutId="textarea"
              value={data.synopsis}
              readOnly
              className="text-sm text-gray-400 mb-3 font-semibold bg-transparent resize-none overflow-hidden pointer-events-none"
            >
              {data.synopsis}
            </motion.textarea>
          )}
        </motion.div>
        <AnimatePresence>
          {hoverExpandDetail && data.killingVerse && (
            <motion.div
              style={{ top: "-76px" }}
              key="container-after"
              layoutId="container"
              className="w-full h-72 absolute left-0 flex flex-col justify-center items-center bg-white border border-logoBrown border-opacity-50 rounded-xl shadow-lg py-5 px-3 cursor-pointer z-10"
            >
              {data.killingVerse.length !== 0 ? (
                <div className="flex flex-col items-center">
                  {data.killingVerse.map((verse: string, index) => (
                    <motion.span
                      className="font-bold italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.5 }}
                    >
                      {verse}
                    </motion.span>
                  ))}
                  <span
                    style={{ top: "5%", right: "5%" }}
                    className="absolute text-xs font-Nanum_Gothic rounded-lg bg-gray-800 text-white px-2 py-1"
                  >
                    클릭해서 열람하기
                  </span>
                </div>
              ) : (
                <motion.textarea
                  style={{ zIndex: 1000 }}
                  layoutId="textarea"
                  value={data.synopsis}
                  readOnly
                  className="px-3 py-2 text-sm text-gray-400 mb-3 overflow-y-scroll font-semibold bg-transparent resize-none h-full w-full cursor-pointer focus:outline-none"
                >
                  {data.synopsis}
                </motion.textarea>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateSharedLayout>
    </motion.div>
  );
};

export default memo(MypageWriting);
