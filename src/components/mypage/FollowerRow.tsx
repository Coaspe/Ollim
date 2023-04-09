import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestoreUser } from "../../type";
import { motion } from "framer-motion";

interface props {
  data: getFirestoreUser;
  setFollowersModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const FollowerRow: React.FC<props> = ({ data, setFollowersModal }) => {
  const navigator = useNavigate();
  return (
    <motion.div
      whileHover={{ y: "-10%" }}
      onClick={() => {
        setFollowersModal(false);
        navigator(`/${data.uid}`);
      }}
      className="w-full flex items-center cursor-pointer shadow-lg px-2 py-1 rounded-2xl"
    >
      <img
        className="w-7 h-7 rounded-full object-cover"
        src={data.profileImg}
        alt="follower"
      />
      <span className="ml-3">{data.username}</span>
    </motion.div>
  );
};

export default memo(FollowerRow);
