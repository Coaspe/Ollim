import { useEffect, useState } from "react";
import { getContetsArrayInfo, getUserByUID } from "../services/firebase";
import { getFirestoreContest, getFirestoreUser } from "../type";

const useGetProfileOwnerInfo = (uid: string | undefined, setProfileImage: React.Dispatch<React.SetStateAction<string>>) => {
    // Profile ownser's firestore information
    const [profileOwnerInfo, setProfileOwnerInfo] = useState<getFirestoreUser>(
        {} as getFirestoreUser
    );
    const [followerUIDs, setFollowerUIDs] = useState<Set<string>>(new Set())
    const [followingUIDs, setFollowingUIDs] = useState<Set<string>>(new Set())

    const [totalContests, setTotalContests] = useState<
        Array<getFirestoreContest>
    >([]);
    // Get profileOwner information
    useEffect(() => {
        const getContests = async (contestsDocID: {
            host: string[];
            participation: string[];
        }) => {
            const host = contestsDocID["host"];
            const participation = contestsDocID["participation"];

            const contests: Array<any> =
                host || participation
                    ? await getContetsArrayInfo(
                        Array.prototype.concat(host, participation)
                    )
                    : [];
            setTotalContests(contests);
        };
        if (uid) {
            // Get user information
            getUserByUID(uid as string).then((res: any) => {
                if (res.username) {
                    setProfileOwnerInfo(res);
                    setProfileImage(res.profileImg);
                    getContests(res.contests);
                    setFollowerUIDs(new Set(res.followers))
                    setFollowingUIDs(new Set(res.followings))
                }
            });
        }
    }, [uid]);

    return {
        profileOwnerInfo,
        followerUIDs,
        followingUIDs,
        totalContests,
        setFollowerUIDs,
    };
};

export default useGetProfileOwnerInfo;
