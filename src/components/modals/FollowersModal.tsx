import { motion } from "framer-motion";
import { useState } from "react";
import FollowerRow from "../mypage/FollowerRow";
import FollowersFollowingsSkeleton from "../skeleton/FollowersFollowingsSkeleton";
import useGetFollowers from "../../hooks/useGetFollowers";

interface props {
  setFollowersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  followersUID: Set<string>;
}

const FollowersModal: React.FC<props> = ({
  setFollowersModalOpen,
  followersUID,
}) => {
  const [loading, setLoading] = useState(false);
  const { followers, handleMoreFollowers } = useGetFollowers(
    setLoading,
    Array.from(followersUID),
  );
  return (
    <motion.div
      animate={{
        backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
      }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: 10000 }}
      className="font-noto fixed w-full h-full items-center justify-center top-0 left-0 flex"
      onClick={() => {
        setFollowersModalOpen(false);
      }}
    >
      <motion.div
        initial={{
          scale: "80%",
          opacity: "0%",
        }}
        animate={{
          scale: "100%",
          opacity: "100%",
        }}
        transition={{
          duration: 0.2,
          type: "spring",
        }}
        className="flex flex-col items-center w-1/4 h-1/2 bg-white py-5 rounded-lg GalaxyS20Ultra:w-4/5"
      >
        <span className="text-xl font-bold text-gray-500 mb-5">팔로워</span>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex flex-col items-center w-full h-full px-10 overflow-y-scrolll"
        >
          {!loading ? (
            <>
              <div className="flex flex-col w-full h-full gap-3 overflow-y-scrolll">
                {followers.map((data) => (
                  <FollowerRow
                    key={data.userEmail}
                    data={data}
                    setFollowersModal={setFollowersModalOpen}
                  />
                ))}
              </div>
              {/* Load more followers button */}
              {followers.length < followersUID.size && (
                <div
                  onClick={handleMoreFollowers}
                  className={`${loading && "pointer-events-none"
                    } font-semibold text-sm shadow-inner cursor-pointer w-1/2 bg-white h-10 flex items-center justify-center rounded-xl text-gray-500`}
                >
                  더 불러오기
                </div>
              )}
            </>
          ) : (
            // Skeleton
            <FollowersFollowingsSkeleton lengthProp={followersUID.size} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FollowersModal;
