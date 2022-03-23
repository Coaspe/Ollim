import { motion } from "framer-motion";
import { memo, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FormatResultUser = (item: any, focus: boolean) => {
  const navigator = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={divRef}
      animate={{ opacity: [0, 1] }}
      layout
      onClick={() => {
        navigator(`/${item.item.uid}`);
      }}
      className="px-5 py-2 flex items-center font-noto cursor-pointer hover:bg-gray-200 focus:bg-gray-200"
    >
      <img
        src={item.item.profileImg}
        alt="profile"
        className="w-7 rounded-full mr-2"
      />
      <span>{item.item.username}</span>
    </motion.div>
  );
};

export default memo(FormatResultUser);
