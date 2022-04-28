import { useCallback, useEffect, useRef, useState } from "react";
import {
  getFollowersInfinite,
  getFollowingsInfinite,
} from "../services/firebase";
import { getFirestoreUser } from "../type";

const useGetFollowers = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  profileOwnerInfo: getFirestoreUser,
  followersModal: boolean,
  followingsModal: boolean
) => {
  // To Prevent unnecessary re-rendering, use useRef
  // Load 5 followers, followings every "Load More" request.
  // Below two variables indicate how many followers, followings loaded now
  const followersKey = useRef(0);
  const followingsKey = useRef(0);

  const [followers, setFollowers] = useState<getFirestoreUser[]>([]);
  const [followings, setFollowings] = useState<getFirestoreUser[]>([]);

  // When modal closed, reset followers, followings keys and list
  useEffect(() => {
    if (!followersModal && followersKey.current !== 0) {
      followersKey.current = 0;
      setFollowers([]);
    }
  }, [followersModal]);

  useEffect(() => {
    if (!followingsModal && followingsKey.current !== 0) {
      followingsKey.current = 0;
      setFollowings([]);
    }
  }, [followingsModal]);

  // Loading more followers, followings completed, set loading false
  useEffect(() => {
    followers.length > 0 && setLoading(false);
  }, [followers]);
  useEffect(() => {
    followings.length > 0 && setLoading(false);
  }, [followings]);

  const handleMoreFollowers = useCallback(() => {
    setLoading(true);
    if (
      profileOwnerInfo.followers.length > 0 &&
      followersKey.current < profileOwnerInfo.followers.length
    ) {
      getFollowersInfinite(
        profileOwnerInfo.followers,
        followersKey.current
      ).then((res) => {
        let tmp = res.docs.map((doc: any) => ({
          ...doc.data(),
          docID: doc.id,
        }));
        setFollowers((origin: any) => {
          return [...origin, ...tmp];
        });
        followersKey.current += tmp.length;
      });
    }
  }, [profileOwnerInfo.followers]);

  const handleMoreFollowings = useCallback(() => {
    setLoading(true);
    if (
      profileOwnerInfo.followings.length > 0 &&
      followingsKey.current < profileOwnerInfo.followings.length
    ) {
      getFollowingsInfinite(
        profileOwnerInfo.followings,
        followingsKey.current
      ).then((res) => {
        let tmp = res.docs.map((doc: any) => ({
          ...doc.data(),
          docID: doc.id,
        }));
        setFollowings((origin: any) => {
          return [...origin, ...tmp];
        });
        followingsKey.current += tmp.length;
      });
    }
  }, [profileOwnerInfo.followings]);

  return {
    followersKey,
    followingsKey,
    followers,
    followings,
    handleMoreFollowers,
    handleMoreFollowings,
  };
};

export default useGetFollowers;
