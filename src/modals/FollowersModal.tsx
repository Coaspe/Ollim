import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import FollowerRow from "../components/FollowerRow";
import FollowersFollowingsSkeleton from "../components/skeletons/FollowersFollowingsSkeleton";
import useGetFollowers from "../hooks/useGetFollowers";
import { getFirestoreUser } from "../type";

interface props {
  followersModalOpen: boolean;
  setFollowersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profileOwnerInfo: getFirestoreUser;
  followersLength: React.MutableRefObject<number>;
}

const FollowersModal: React.FC<props> = ({
  followersModalOpen,
  setFollowersModalOpen,
  profileOwnerInfo,
  followersLength,
}) => {
  const [loading, setLoading] = useState(false);

  const { followersKey, followers, handleMoreFollowers } = useGetFollowers(
    setLoading,
    profileOwnerInfo,
    followersModalOpen
  );
  useEffect(() => {
    console.log(profileOwnerInfo);
  }, []);
  return (
    <AnimatePresence>
      {followersModalOpen && profileOwnerInfo && (
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
            animate={{
              scale: ["80%", "100%"],
              opacity: ["0%", "100%"],
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
                followers.map((data) => (
                  <FollowerRow
                    key={data.userEmail}
                    data={data}
                    setFollowersModal={setFollowersModalOpen}
                  />
                ))
              ) : (
                // Skeleton
                <FollowersFollowingsSkeleton
                  lengthProp={followersLength.current}
                />
              )}
              {/* Load more followers button */}
              {followersKey.current < profileOwnerInfo.followers.length && (
                <div
                  onClick={handleMoreFollowers}
                  className={`${
                    loading && "pointer-events-none"
                  } font-semibold text-sm shadow-inner cursor-pointer w-1/2 bg-white h-10 flex items-center justify-center rounded-xl text-gray-500`}
                >
                  {!loading && "Load more..."}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowersModal;
