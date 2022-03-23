import { motion } from "framer-motion";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { genreMatching } from "../page/Writing";
import { gerneType } from "../type";
interface props {
  item: any;
}
const FormatResultWriting: React.FC<props> = ({ item }) => {
  const navigator = useNavigate();

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      layout
      key={item.writingUID}
      onClick={() => {
        navigator(`/writings/${item.userUID}/${item.genre}/${item.writingUID}`);
      }}
      className="px-5 py-2 space-x-2 flex items-center font-noto cursor-pointer hover:bg-gray-200 focus:bg-gray-200"
    >
      <span className="font-bold">
        {genreMatching[item.genre as gerneType]}
      </span>
      <span>-</span>
      <span>{item.title}</span>
    </motion.div>
  );
};

export default memo(FormatResultWriting);
