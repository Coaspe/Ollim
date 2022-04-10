import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { memo, useState } from "react";
import { contestWriting } from "../type";
interface props {
  data: contestWriting;
  medal?: string;
  widthSize: number;
  handleOnClick: (selectedWritingDocID: string) => void;
}
const ContestWriting: React.FC<props> = ({
  data,
  widthSize,
  handleOnClick,
}) => {
  const [hoverExpandDetail, setHoverExpandDetail] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <motion.div
      layout
      animate={{ opacity: [0, 1] }}
      onClick={() => {
        handleOnClick(data.writingDocID);
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
      className="relative w-full h-full"
    >
      <AnimateSharedLayout>
        <motion.div
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
            <div className="flex items-center space-x-3">
              <span className="text-xl font-black GalaxyS20Ultra:text-sm">
                {data.title.length > 9
                  ? `${data.title.slice(0, 10)} ...`
                  : data.title}
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
          {hoverExpandDetail && (
            <motion.div
              style={{ top: "-76px" }}
              key="container-after"
              layoutId="container"
              className="w-full h-72 absolute left-0 flex flex-col justify-center items-center bg-white border border-logoBrown border-opacity-50 rounded-xl shadow-lg py-5 px-3 cursor-pointer z-10"
            >
              <motion.textarea
                style={{ zIndex: 1000 }}
                layoutId="textarea"
                value={data.synopsis}
                readOnly
                className="px-3 py-2 text-sm text-gray-400 mb-3 overflow-y-scroll font-semibold bg-transparent resize-none h-full w-full cursor-pointer focus:outline-none"
              >
                {data.synopsis}
              </motion.textarea>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimateSharedLayout>
    </motion.div>
  );
};

export default memo(ContestWriting);