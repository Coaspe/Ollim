import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import MypageWriting from "../components/writing/MypageWriting";
import UserContext from "../context/user";
import { getUserByUID, getContetsArrayInfo } from "../services/firebase";
import { signOutAuth } from "../helpers/auth-OAuth2";
import NewWritingModal from "../modals/NewWritingModal";
import CustomNodeFlow from "../components/diagram/RelationShipDiagram";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { RootState } from "../redux/store";
import {
  alarmType,
  getFirestoreUser,
  getFirestoreContest,
  contestType,
  options,
} from "../type";
import { alarmAction, userInfoAction, widthSizeAction } from "../redux";
import { useNavigate, useParams } from "react-router-dom";

import Calendar from "../components/calendar/Calendar";
import { Alert, Tooltip } from "@mui/material";
import axios from "axios";

import Header from "../components/Header";
import Select from "react-select";
import NewContestModal from "../modals/NewContestModal";
import ContestRow from "../components/contest/ContestRow";

import useImageCompress from "../hooks/useImageCompress";
import useGetWritings from "../hooks/useGetWritings";
import MypageSkeleton from "../components/skeleton/MypageSkeleton";

import { alertVariants } from "../components/constants/variants";
import FollowersModal from "../modals/FollowersModal";
import FollowingsModal from "../modals/FollowingsModal";

const Mypage = () => {
  // Profile owner's uid
  const { uid } = useParams();
  // Profile ownser's firestore information
  const [profileOwnerInfo, setProfileOwnerInfo] = useState<getFirestoreUser>(
    {} as getFirestoreUser
  );

  // For more natural UI of the number of followers of followings, followers
  const followingsLength = useRef(0);
  const followersLength = useRef(0);

  // Profile owner's followers, followings datas and modal open states
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingsModalOpen, setFollowingsModalOpen] = useState(false);

  // Context user
  const { user: contextUser } = useContext(UserContext);

  // New Writing modal state
  const [newWritingModalOpen, setNewWritingModalOpen] = useState(false);
  // New Contest modal state
  const [newContestModalOpen, setNewContestModalOpen] = useState(false);
  // Writing category state
  const [onWritingCategory, setOnWritingCategory] = useState("TOTAL");
  // Contest category state
  const [contestCategory, setContestCategory] = useState<contestType>("TOTAL");

  // Does User Follow Profile Owner?
  const [doseUserFollow, setDoseUserFollow] = useState(false);

  const [totalContests, setTotalContests] = useState<
    Array<getFirestoreContest>
  >([]);
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  // Header context redux userInfo
  const setUserInfo = (userInfo: getFirestoreUser) => {
    dispatch(userInfoAction.setUserInfo({ userInfo }));
  };
  const userInfo = useAppSelector(
    (state: RootState) => state.setUserInfo.userInfo
  );

  // Window width size
  const setWidthSize = (widthSize: number) => {
    dispatch(widthSizeAction.setWidthSize({ widthSize }));
  };
  const widthSize = useAppSelector(
    (state: RootState) => state.setWidthSize.widthSize
  );
  const alarm = useAppSelector((state: RootState) => state.setAlarm.alarm);
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };
  const { profileImage, setProfileImage, handleProfileImgOnChange } =
    useImageCompress(profileOwnerInfo, setAlarm);

  // Window size changed detect!
  useEffect(() => {
    window.onresize = () => {
      setWidthSize(window.innerWidth);
    };
  }, []);

  const {
    poems,
    novels,
    scenarioes,
    totalWritings,
    userWritings,
    writingsLoading,
  } = useGetWritings(uid);

  // Get profileOwner's and user's information
  useEffect(() => {
    const getContests = async (contestsDocID: {
      host: string[];
      participation: string[];
    }) => {
      const host = contestsDocID["host"];
      const participation = contestsDocID["participation"];

      const tmp: Array<any> =
        host || participation
          ? await getContetsArrayInfo(
            Array.prototype.concat(host, participation)
          )
          : [];
      setTotalContests(tmp);
    };
    if (uid) {
      // Get user information
      getUserByUID(uid as string).then((res: any) => {
        if (res.username) {
          setProfileOwnerInfo(res);
          setProfileImage(res.profileImg);
          getContests(res.contests);
          followersLength.current = res.followers.length;
          followingsLength.current = res.followings.length;
        }
      });

      followingsLength.current = 0;
      followersLength.current = 0;
    }
  }, [uid]);

  // Get context user's information
  useEffect(() => {
    profileOwnerInfo.userEmail &&
      contextUser &&
      contextUser.uid &&
      getUserByUID(contextUser.uid).then((res: any) => {
        if (res.uid) {
          setUserInfo(res);
          setDoseUserFollow(res.followings.includes(profileOwnerInfo.uid));
        }
      });
  }, [profileOwnerInfo, contextUser]);

  // Navigate to community
  const handleGoToCommunity = () => {
    navigator("/community");
  };
  return (
    <>
      {followersModalOpen && profileOwnerInfo && (
        <FollowersModal
          followersModalOpen={followersModalOpen}
          setFollowersModalOpen={setFollowersModalOpen}
          profileOwnerInfo={profileOwnerInfo}
          followersLength={followersLength}
        />
      )}
      {followingsModalOpen && profileOwnerInfo && (
        <FollowingsModal
          followingsModalOpen={followingsModalOpen}
          setFollowingsModalOpen={setFollowingsModalOpen}
          profileOwnerInfo={profileOwnerInfo}
          followingsLength={followingsLength}
        />
      )}

      {/* Alarm */}
      <AnimatePresence>
        {alarm[2] && (
          <motion.div
            variants={alertVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ zIndex: 2000 }}
            className="fixed w-1/2 top-5 translate-x-1/2 left-1/4"
          >
            <Alert severity={alarm[1]}>{alarm[0]}</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Writing Modal */}
      {newWritingModalOpen && (
        <NewWritingModal setNewWritingModalOpen={setNewWritingModalOpen} />
      )}
      {/* New Writing Modal */}
      {newContestModalOpen && (
        <NewContestModal setNewContestModalOpen={setNewContestModalOpen} />
      )}
      {/* Header */}
      {<Header userInfo={userInfo} />}
      {profileOwnerInfo && !writingsLoading ? (
        <div className="font-noto w-full flex flex-col items-center justify-between">
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
                  profileOwnerInfo.profileImg || "/svg/user-svgrepo-com.svg"
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
                    origin
                      ? (followersLength.current -= 1)
                      : (followersLength.current += 1);
                    axios.post(
                      `https://ollim.onrender.com/updateFollowing`,
                      {
                        followingUserEmail: userInfo.userEmail,
                        followedUserEmail: profileOwnerInfo.userEmail,
                        followingUserUID: userInfo.uid,
                        followedUserUID: profileOwnerInfo.uid,
                        followingUsername: userInfo.username,
                        followingState: origin,
                      }
                    );
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
                onClick={signOutAuth}
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
                {totalWritings.length}
              </span>
              <span>글</span>
            </div>
            <div
              onClick={() => {
                followersLength.current && setFollowersModalOpen(true);
              }}
              className="flex flex-col items-center justify-center mx-5 cursor-pointer"
            >
              <span className="font-bold text-gray-400 font-Nanum_Gothic">
                {followersLength.current}
              </span>
              <span>팔로워</span>
            </div>
            <div
              onClick={() => {
                followingsLength.current && setFollowingsModalOpen(true);
              }}
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="font-bold text-gray-400 font-Nanum_Gothic">
                {followingsLength.current}
              </span>
              <span>팔로우</span>
            </div>
          </div>
          <div className="flex w-full items-center justify-center my-10 space-x-5">
            {widthSize > 500 && contextUser && uid === contextUser.uid && (
              <motion.button
                onClick={() => {
                  setNewWritingModalOpen(true);
                }}
                whileHover={{ y: "-10%" }}
                className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold"
              >
                새 작품 추가
              </motion.button>
            )}
            {contextUser &&
              uid === contextUser.uid &&
              userInfo.contestAuth && (
                <motion.button
                  onClick={() => {
                    setNewContestModalOpen(true);
                  }}
                  whileHover={{ y: "-10%" }}
                  className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold"
                >
                  백일장 개최
                </motion.button>
              )}
            {/* <motion.button
              onClick={handleGoToCommunity}
              whileHover={{ y: "-10%" }}
              className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold"
            >
              다른 작가의 작품보기
            </motion.button> */}
          </div>

          {/* Calendar */}
          <Calendar
            totalCommits={userWritings.totalCommits}
            widthSize={widthSize}
          />

          {/* On writing */}
          <div className="flex px-5 py-5 items-center flex-col my-20 w-2/3 GalaxyS20Ultra:my-10">
            <div className="w-full grid grid-cols-3 items-center mb-10 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:space-y-10">
              <span className="text-2xl font-bold justify-center col-start-2 w-full text-center">
                작가의 글
              </span>
              <div className="flex items-center place-self-end col-start-3 gap-4 text-sm GalaxyS20Ultra:w-full GalaxyS20Ultra:justify-center">
                <Tooltip title="소설" placement="top" arrow>
                  <motion.span
                    animate={{
                      color:
                        onWritingCategory === "NOVEL"
                          ? "#334155"
                          : "#94a3b8",
                      backgroundColor:
                        onWritingCategory === "NOVEL"
                          ? "#f5e1db"
                          : "transparent",
                    }}
                    onClick={() => {
                      setOnWritingCategory("NOVEL");
                    }}
                    style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                    className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor ${onWritingCategory === "NOVEL"
                      ? "text-slate-700 bg-genreSelectedBG"
                      : "text-slate-400"
                      }`}
                  >
                    menu_book
                  </motion.span>
                </Tooltip>
                <Tooltip title="시" placement="top" arrow>
                  <motion.span
                    animate={{
                      color:
                        onWritingCategory === "POEM"
                          ? "#334155"
                          : "#94a3b8",
                      backgroundColor:
                        onWritingCategory === "POEM"
                          ? "#f5e1db"
                          : "transparent",
                    }}
                    onClick={() => {
                      setOnWritingCategory("POEM");
                    }}
                    style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                    className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor`}
                  >
                    history_edu
                  </motion.span>
                </Tooltip>
                <Tooltip title="시나리오" placement="top" arrow>
                  <motion.span
                    animate={{
                      color:
                        onWritingCategory === "SCENARIO"
                          ? "#334155"
                          : "#94a3b8",
                      backgroundColor:
                        onWritingCategory === "SCENARIO"
                          ? "#f5e1db"
                          : "transparent",
                    }}
                    onClick={() => {
                      setOnWritingCategory("SCENARIO");
                    }}
                    style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                    className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor`}
                  >
                    adf_scanner
                  </motion.span>
                </Tooltip>
                <Tooltip title="전체" placement="top" arrow>
                  <motion.span
                    animate={{
                      color:
                        onWritingCategory === "TOTAL"
                          ? "#334155"
                          : "#94a3b8",
                      backgroundColor:
                        onWritingCategory === "TOTAL"
                          ? "#f5e1db"
                          : "transparent",
                    }}
                    onClick={() => {
                      setOnWritingCategory("TOTAL");
                    }}
                    style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                    className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor`}
                  >
                    clear_all
                  </motion.span>
                </Tooltip>
              </div>
            </div>

            <motion.div
              layout
              className="grid grid-cols-3 items-center justify-between w-full gap-5 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:overflow-y-scroll GalaxyS20Ultra:max-h-72 GalaxyS20Ultra:py-5 GalaxyS20Ultra:px-3"
            >
              {onWritingCategory === "NOVEL" &&
                novels &&
                novels.map((data) => (
                  <MypageWriting
                    key={data.dateCreated}
                    data={data}
                    widthSize={widthSize}
                  />
                ))}
              {onWritingCategory === "POEM" &&
                poems &&
                poems.map((data) => (
                  <MypageWriting
                    key={data.dateCreated}
                    data={data}
                    widthSize={widthSize}
                  />
                ))}
              {onWritingCategory === "SCENARIO" &&
                scenarioes &&
                scenarioes.map((data) => (
                  <MypageWriting
                    key={data.dateCreated}
                    data={data}
                    widthSize={widthSize}
                  />
                ))}
              {onWritingCategory === "TOTAL" &&
                totalWritings &&
                totalWritings.map((data) => {
                  return (
                    <MypageWriting
                      key={data.dateCreated}
                      data={data}
                      widthSize={widthSize}
                    />
                  );
                })}
            </motion.div>
          </div>

          {/* Contest */}
          <div className="flex px-5 items-center flex-col mb-20 w-2/3 GalaxyS20Ultra:mb-10">
            <div className="w-full grid grid-cols-3 items-center mb-10 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:space-y-10">
              <span className="text-2xl font-bold justify-center col-start-2 w-full text-center">
                올림 백일장
              </span>
              <div className="flex items-center place-self-end col-start-3 text-sm GalaxyS20Ultra:w-full GalaxyS20Ultra:justify-center">
                <Select
                  options={options}
                  defaultValue={options[2]}
                  onChange={(e) => {
                    e && setContestCategory(e.value);
                  }}
                />
              </div>
            </div>

            <motion.div
              layout
              className="grid grid-cols-3 items-center justify-between w-full gap-5 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:overflow-y-scroll GalaxyS20Ultra:max-h-72 GalaxyS20Ultra:py-5 GalaxyS20Ultra:px-3"
            >
              {contestCategory === "TOTAL" &&
                totalContests.map((data) => (
                  <ContestRow
                    key={data.dateCreated}
                    data={data}
                    widthSize={widthSize}
                  />
                ))}
            </motion.div>
          </div>
        </div>
      ) : (
        <MypageSkeleton widthSize={widthSize} />
      )}
    </>
  );
};

export default Mypage;
