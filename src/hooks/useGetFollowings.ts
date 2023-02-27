import { useCallback, useEffect, useRef, useState } from "react";
import { getFollowingsInfinite } from "../services/firebase";
import { getFirestoreUser } from "../type";

const useGetFollowings = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  followingsUID: string[],
  followingsModal: boolean
) => {
  // To Prevent unnecessary re-rendering, use useRef
  // Load 5 followers, followings every "Load More" request.
  // Below two variables indicate how many followers, followings loaded now
  const followingsKey = useRef(0);

  const [followings, setFollowings] = useState<getFirestoreUser[]>([]);

  // When modal closed, reset followers, followings keys and list

  useEffect(() => {
    if (!followingsModal && followingsKey.current !== 0) {
      followingsKey.current = 0;
      setFollowings([]);
    }
    if (followingsModal && followingsKey.current === 0) {
      handleMoreFollowings();
    }
  }, [followingsModal]);

  // Loading more followers, followings completed, set loading false
  useEffect(() => {
    followings.length > 0 && setLoading(false);
  }, [followings]);

  const handleMoreFollowings = useCallback(async () => {
    setLoading(true);
    if (
      followingsUID.length > 0 &&
      followingsKey.current < followingsUID.length
    ) {
      try {
        const res = await getFollowingsInfinite(
          followingsUID,
          followingsKey.current
        );
        let tmp = res.docs.map((doc: any) => ({
          ...doc.data(),
          docID: doc.id,
        }));
        setFollowings((origin: any) => {
          return [...origin, ...tmp];
        });
        followingsKey.current += tmp.length;
      } catch (error) {
        console.log(error);
      }
    }
  }, [followingsUID]);

  return {
    followingsKey,
    followings,
    handleMoreFollowings,
  };
};

export default useGetFollowings;
