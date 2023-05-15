import { useCallback, useEffect, useState } from "react";
import { getFollowersInfinite } from "../services/firebase";
import { getFirestoreUser } from "../type";

const useGetFollowers = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  followersUID: string[],
) => {
  // Load 5 followers, followers every "Load More" request.
  // Below two variables indicate how many followers, followings loaded now
  const [followers, setFollowers] = useState<getFirestoreUser[]>([]);
  const handleMoreFollowers = useCallback(async () => {
    if (
      followersUID?.length > 0 &&
      followers.length < followersUID.length
    ) {
      try {
        setLoading(true);
        const res = await getFollowersInfinite(
          followersUID,
          followers.length
        );
        let tmp = res.docs.map((doc: any) => ({
          ...doc.data(),
          docID: doc.id,
        }));
        setFollowers((origin: any) => {
          return [...origin, ...tmp];
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
  }, [followersUID]);

  useEffect(() => {
    handleMoreFollowers();
  }, []);

  return {
    followers,
    handleMoreFollowers,
  };
};

export default useGetFollowers;
