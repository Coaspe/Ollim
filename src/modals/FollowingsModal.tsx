import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import FollowerRow from "../components/FollowerRow";
import FollowersFollowingsSkeleton from "../components/skeletons/FollowersFollowingsSkeleton";
import useGetFollowings from "../hooks/useGetFollowings";
import { getFirestoreUser } from "../type";

interface props {
  followingsModalOpen: boolean;
  setFollowingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profileOwnerInfo: getFirestoreUser;
  followingsLength: React.MutableRefObject<number>;
}

const FollowingsModal: React.FC<props> = ({
  followingsModalOpen,
  setFollowingsModalOpen,
  profileOwnerInfo,
  followingsLength,
}) => {
  const [loading, setLoading] = useState(false);
  const { followingsKey, followings, handleMoreFollowings } = useGetFollowings(
    setLoading,
    profileOwnerInfo,
    followingsModalOpen
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
        setFollowingsModalOpen(false);
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
          className="flex flex-col items-center w-full h-full px-10 gap-3 overflow-y-scrolll"
        >
          {!loading ? (
            <>
              {followings.map((data) => (
                <FollowerRow
                  key={data.userEmail}
                  data={data}
                  setFollowersModal={setFollowingsModalOpen}
                />
              ))}
              {/* Load more followers button */}
              {followingsKey.current < profileOwnerInfo.followers.length && (
                <div
                  onClick={handleMoreFollowings}
                  className={`${
                    loading && "pointer-events-none"
                  } font-semibold text-sm shadow-inner cursor-pointer w-1/2 bg-white h-10 flex items-center justify-center rounded-xl text-gray-500`}
                >
                  {!loading && "더 불러오기"}
                </div>
              )}
            </>
          ) : (
            // Skeleton
            <FollowersFollowingsSkeleton
              lengthProp={followingsLength.current}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FollowingsModal;
