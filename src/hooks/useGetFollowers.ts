import { useCallback, useEffect, useRef, useState } from "react";
import { getFollowersInfinite } from "../services/firebase";
import { getFirestoreUser } from "../type";

const useGetFollowers = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  profileOwnerInfo: getFirestoreUser,
  followersModalOpen: boolean
) => {
  // To Prevent unnecessary re-rendering, use useRef
  // Load 5 followers, followings every "Load More" request.
  // Below two variables indicate how many followers, followings loaded now
  const followersKey = useRef(0);
  const [followers, setFollowers] = useState<getFirestoreUser[]>([]);
  const handleMoreFollowers = useCallback(async () => {
    setLoading(true);
    if (
      profileOwnerInfo.followers?.length > 0 &&
      followersKey.current < profileOwnerInfo.followers.length
    ) {
      try {
        const res = await getFollowersInfinite(
          profileOwnerInfo.followers,
          followersKey.current
        );
        let tmp = res.docs.map((doc: any) => ({
          ...doc.data(),
          docID: doc.id,
        }));
        setFollowers((origin: any) => {
          return [...origin, ...tmp];
        });
        followersKey.current += tmp.length;
      } catch (error) {
        console.log(error);
      }
    }
  }, [profileOwnerInfo.followers]);

  // When modal closed, reset followers, followings keys and list
  useEffect(() => {
    if (!followersModalOpen && followersKey.current !== 0) {
      followersKey.current = 0;
      setFollowers([]);
    }
    if (followersModalOpen && followersKey.current === 0) {
      handleMoreFollowers();
    }
  }, [followersModalOpen, handleMoreFollowers]);

  // Loading more followers, followings completed, set loading false
  useEffect(() => {
    followers.length > 0 && setLoading(false);
  }, [followers]);

  return {
    followersKey,
    followers,
    handleMoreFollowers,
  };
};

export default useGetFollowers;
