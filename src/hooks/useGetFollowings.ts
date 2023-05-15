import { useCallback, useEffect, useState } from "react";
import { getFollowingsInfinite } from "../services/firebase";
import { getFirestoreUser } from "../type";

const useGetFollowings = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  followingsUID: string[],
) => {
  // Load 5 followers, followings every "Load More" request.
  // Below two variables indicate how many followers, followings loaded now
  const [followings, setFollowings] = useState<getFirestoreUser[]>([]);
  const handleMoreFollowings = useCallback(async () => {
    if (
      followingsUID?.length > 0 &&
      followings.length < followingsUID.length
    ) {
      try {
        setLoading(true);
        const res = await getFollowingsInfinite(
          followingsUID,
          followings.length
        );
        let newFollowings = res.docs.map((doc: any) => ({
          ...doc.data(),
          docID: doc.id,
        }));
        setFollowings((origin: any) => {
          return [...origin, ...newFollowings];
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
  }, [followingsUID]);

  useEffect(() => {
    handleMoreFollowings();
  }, []);

  return {
    followings,
    handleMoreFollowings,
  };
};

export default useGetFollowings;
