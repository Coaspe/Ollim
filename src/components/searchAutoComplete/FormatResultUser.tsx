import { motion } from "framer-motion";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
interface props {
  item: any;
}
const FormatResultUser: React.FC<props> = ({ item }) => {
  const navigator = useNavigate();
  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      layout
      onClick={(e) => {
        navigator(`/${item.uid}`);
      }}
      className="px-5 py-2 flex items-center font-noto cursor-pointer hover:bg-gray-200 focus:bg-gray-200 z-50"
    >
      <img
        src={item.profileImg}
        alt="profile"
        className="w-7 rounded-full mr-2"
      />
      <span>{item.username}</span>
    </motion.div>
  );
};

export default memo(FormatResultUser);
