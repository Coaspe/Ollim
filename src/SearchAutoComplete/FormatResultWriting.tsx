import { motion } from "framer-motion";
import { memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { genreMatching } from "../page/Writing";
import { gerneType } from "../type";

const FormatResultWriting = (item: any, focus: boolean) => {
  const navigator = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={divRef}
      animate={{ opacity: [0, 1] }}
      layout
      key={item.item.writingUID}
      onClick={() => {
        navigator(
          `/writings/${item.item.userUID}/${item.item.genre}/${item.item.writingUID}`
        );
      }}
      className="px-5 py-2 space-x-2 flex items-center font-noto cursor-pointer hover:bg-gray-200 focus:bg-gray-200"
    >
      <span className="font-bold">
        {genreMatching[item.item.genre as gerneType]}
      </span>
      <span>-</span>
      <span>{item.item.title}</span>
    </motion.div>
  );
};

export default memo(FormatResultWriting);
