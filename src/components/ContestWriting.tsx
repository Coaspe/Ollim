import { motion } from "framer-motion";
import { memo } from "react";
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
  return (
    <motion.div
      layout
      animate={{ opacity: [0, 1] }}
      onClick={() => {
        handleOnClick(data.writingDocID);
      }}
      className="relative w-full h-full"
    >
      <motion.div className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-5 z-0">
        <div className="mb-3 flex items-center justify-between GalaxyS20Ultra:flex-col">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-black GalaxyS20Ultra:text-sm">
              {data.title.length > 9
                ? `${data.title.slice(0, 10)} ...`
                : data.title}
            </span>
            {data.collectionTitle && (
              <span>{` - ${data.collectionTitle}`}</span>
            )}
          </div>
        </div>
        {widthSize > 500 && (
          <motion.textarea
            value={data.synopsis}
            readOnly
            className="text-sm text-gray-400 mb-3 font-semibold bg-transparent resize-none overflow-hidden pointer-events-none"
          >
            {data.synopsis}
          </motion.textarea>
        )}
      </motion.div>
    </motion.div>
  );
};

export default memo(ContestWriting);
