import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/user";
import { signOutAuth } from "../../helpers/auth-OAuth2";
import useImageCompress from "../../hooks/useImageCompress";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { alarmAction } from "../../redux";
import { RootState } from "../../redux/store";
import { updateFollowing } from "../../services/firebase";
import { alarmType, contestType, getFirestoreContest, getFirestoreUser } from "../../type";
import FollowersModal from "../modals/FollowersModal";
import FollowingsModal from "../modals/FollowingsModal";

type props = {
    uid: string | undefined,
    profileImage: string,
    profileOwnerInfo: getFirestoreUser,
    setProfileImage: React.Dispatch<React.SetStateAction<string>>
    followers: Set<string>,
    followings: Set<string>,
    totalContests: getFirestoreContest[],
    setFollowers: React.Dispatch<React.SetStateAction<Set<string>>>,
    writingsLength: number
}
const Profile: React.FC<props> = ({
    uid,
    profileImage,
    profileOwnerInfo,
    setProfileImage,
    followers,
    followings,
    totalContests,
    setFollowers,
    writingsLength
}) => {
    const { user: contextUser } = useContext(UserContext);
    const userInfo = useAppSelector(
        (state: RootState) => state.setUserInfo.userInfo
    );

    const dispatch = useAppDispatch();
    const setAlarm = (alarm: [string, alarmType, boolean]) => {
        dispatch(alarmAction.setAlarm({ alarm }));
    };

    // Contest category state
    const [contestCategory, setContestCategory] = useState<contestType>("TOTAL");
    const handleProfileImgOnChange =
        useImageCompress(profileOwnerInfo, setAlarm, setProfileImage);

    // Does User Follow Profile Owner?
    const [doseUserFollow, setDoseUserFollow] = useState(false);
    // Profile owner's followers, followings datas and modal open states
    const [followersModalOpen, setFollowersModalOpen] = useState(false);
    const [followingsModalOpen, setFollowingsModalOpen] = useState(false);
    useEffect(() => {
        contextUser && setDoseUserFollow(followers.has(contextUser.uid))
    }, [])
    return <>
        {followersModalOpen && profileOwnerInfo && (
            <FollowersModal
                setFollowersModalOpen={setFollowersModalOpen}
                followersUID={followers}
            />
        )}
        {followingsModalOpen && profileOwnerInfo && (
            <FollowingsModal
                setFollowingsModalOpen={setFollowingsModalOpen}
                followingsUID={followings}
            />
        )}
        {/* Profile Image */}
        <div className="relative">
            {/* Profile Image Edit */}
            <label htmlFor="profileImg">
                <div className="opacity-0 absolute flex items-center justify-center rounded-full w-full h-full cursor-pointer hover:opacity-20 hover:bg-black" />
                <motion.img
                    animate={{ scale: [0, 1] }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className="rounded-full w-64 h-64 shadow-xl object-cover"
                    src={
                        profileImage || profileOwnerInfo.profileImg || "/svg/user-svgrepo-com.svg"
                    }
                    alt="profile"
                />
            </label>
            {contextUser && contextUser.uid && contextUser.uid === uid && (
                <input
                    onChange={handleProfileImgOnChange}
                    style={{ display: "none" }}
                    type="file"
                    name="profileImg"
                    id="profileImg"
                />
            )}
        </div>

        {/* Username */}
        <div className="flex items-center justify-center">
            <span className="text-2xl font-bold my-7 mr-3">
                {profileOwnerInfo.username}
            </span>
            {uid && contextUser && contextUser.uid && contextUser.uid !== uid && (
                <button
                    onClick={() => {
                        setDoseUserFollow((origin) => {
                            setFollowers((originSet) => {
                                if (origin) {
                                    originSet.delete(contextUser.uid)
                                } else {
                                    originSet.add(contextUser.uid)
                                }
                                return new Set(originSet)
                            })
                            updateFollowing(
                                profileOwnerInfo.userEmail,
                                profileOwnerInfo.uid,
                                origin,
                                userInfo.userEmail,
                                userInfo.uid,
                                userInfo.username,)
                            return !origin;
                        });
                    }}
                    className={`${!doseUserFollow ? "bg-blue-400" : "bg-gray-300"
                        } px-2 py-1 rounded-xl text-xs font-Nanum_Gothic font-bold text-gray-700`}
                >
                    {doseUserFollow ? "팔로우 취소" : "팔로우"}
                </button>
            )}
            {contextUser && contextUser.uid === uid && (
                <svg
                    onClick={() => {
                        if (window.localStorage.getItem("TEST_ACCOUNT")) {
                            window.localStorage.removeItem("TEST_ACCOUNT")
                        }
                        signOutAuth()
                    }}
                    className="w-7 cursor-pointer"
                    x="0px"
                    y="0px"
                    viewBox="0 0 490.3 490.3"
                >
                    <g>
                        <g>
                            <path
                                d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
                                            s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
                                            c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
                                            C27.9,58.95,0,86.75,0,121.05z"
                            />
                            <path
                                d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
                                            c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
                                            C380.6,325.15,380.6,332.95,385.4,337.65z"
                            />
                        </g>
                    </g>
                </svg>
            )}
        </div>

        {/* Posts, Followers, Followings */}
        <div className="flex w-full items-center justify-center text-sm">
            <div className="flex flex-col items-center justify-center">
                <span className="font-bold text-gray-400 font-Nanum_Gothic">
                    {writingsLength}
                </span>
                <span>글</span>
            </div>
            <div
                onClick={() => {
                    followers.size && setFollowersModalOpen(true);
                }}
                className="flex flex-col items-center justify-center mx-5 cursor-pointer"
            >
                <span className="font-bold text-gray-400 font-Nanum_Gothic">
                    {followers.size}
                </span>
                <span>팔로워</span>
            </div>
            <div
                onClick={() => {
                    followings.size && setFollowingsModalOpen(true);
                }}
                className="flex flex-col items-center justify-center cursor-pointer"
            >
                <span className="font-bold text-gray-400 font-Nanum_Gothic">
                    {followings.size}
                </span>
                <span>팔로우</span>
            </div>
        </div>

    </>
}

export default Profile