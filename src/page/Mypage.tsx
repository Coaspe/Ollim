import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MypageWriting from "../components/MypageWriting";
import UserContext from "../context/user";
import {
  getUserWritings,
  getWritingsArrayInfo,
  getUserByUID,
  getFollowersInfinite,
  getFollowingsInfinite,
  getContetsArrayInfo,
} from "../services/firebase";
import Compressor from "compressorjs";
import { signOutAuth } from "../helpers/auth-OAuth2";
import NewWritingModal from "../modals/NewWritingModal";
import CustomNodeFlow from "../diagram/RelationShipDiagram";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  alarmType,
  getFirestoreWriting,
  getFirestoreUser,
  getFirestoreUserWritings,
  getFirestoreContest,
  contestType,
} from "../type";
import { alarmAction, userInfoAction, widthSizeAction } from "../redux";
import { useNavigate, useParams } from "react-router-dom";

import Calendar from "../components/Calendar";
import { Alert, Tooltip } from "@mui/material";
import axios from "axios";
import FollowingRow from "../components/FollowingRow";
import FollowerRow from "../components/FollowerRow";
import FollowersFollowingsSkeleton from "../components/FollowersFollowingsSkeleton";
import Header from "../components/Header";
import Select from "react-select";
import NewContestModal from "../modals/NewContestModal";
import ContestRow from "../components/ContestRow";

const Mypage = () => {
  // Profile owner's uid
  const { uid } = useParams();
  // Profile ownser's firestore information
  const [profileOwnerInfo, setProfileOwnerInfo] = useState<getFirestoreUser>(
    {} as getFirestoreUser
  );
  const [profileImage, setProfileImage] = useState("");

  // To Prevent unnecessary re-rendering, use useRef
  // Load 5 followers, followings every "Load More" request.
  // Below two variables indicate how many followers, followings loaded now
  const followersKey = useRef(0);
  const followingsKey = useRef(0);

  // For more natural UI of the number of followers of followings, followers
  const followingsLength = useRef(0);
  const followersLength = useRef(0);

  // Profile owner's followers, followings datas and modal open states
  const [followers, setFollowers] = useState<getFirestoreUser[]>([]);
  const [followings, setFollowings] = useState<getFirestoreUser[]>([]);
  const [followersModal, setFollowersModal] = useState(false);
  const [followingsModal, setFollowingsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Context user
  const { user: contextUser } = useContext(UserContext);
  const [userWritings, setUserWritings] = useState(
    {} as getFirestoreUserWritings
  );
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
  // Profile owner's poems list
  const [poems, setPoems] = useState<Array<getFirestoreWriting>>([]);
  // Profile owner's novels list
  const [novels, setNovels] = useState<Array<getFirestoreWriting>>([]);
  // Profile owner's scenarioes list
  const [scenarioes, setScenarioes] = useState<Array<getFirestoreWriting>>([]);
  // Profile owner's total writings list
  const [totalWritings, setTotalWritings] = useState<
    Array<getFirestoreWriting>
  >([]);

  const [totalContests, setTotalContests] = useState<
    Array<getFirestoreContest>
  >([]);
  const navigator = useNavigate();
  const dispatch = useDispatch();

  // Header context userInfo
  const setUserInfo = (userInfo: getFirestoreUser) => {
    dispatch(userInfoAction.setUserInfo({ userInfo }));
  };
  const userInfo = useSelector(
    (state: RootState) => state.setUserInfo.userInfo
  );

  // Window width size
  const setWidthSize = (widthSize: number) => {
    dispatch(widthSizeAction.setWidthSize({ widthSize }));
  };
  const widthSize = useSelector(
    (state: RootState) => state.setWidthSize.widthSize
  );

  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };

  // Load more profile owner's followers, followings
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

  useEffect(() => {
    window.onresize = () => {
      setWidthSize(window.innerWidth);
    };
  }, []);

  // Loading more followers, followings completed, set loading false
  useEffect(() => {
    followers.length > 0 && setLoading(false);
  }, [followers]);
  useEffect(() => {
    followings.length > 0 && setLoading(false);
  }, [followings]);

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

  // Uid param change detection
  useEffect(() => {
    followingsLength.current = 0;
    followersLength.current = 0;
  }, [uid]);

  // Get profileOwner's user information and user's writings information
  useEffect(() => {
    // Get and Set profileOwner's writings information function
    const getWritings = async (userWritings: getFirestoreUserWritings) => {
      const poems = userWritings.poemDocID
        ? (
            (await getWritingsArrayInfo(
              userWritings.poemDocID
            )) as Array<getFirestoreWriting>
          ).sort((a, b) => b.dateCreated - a.dateCreated)
        : [];
      const novel = userWritings.novelDocID
        ? (
            (await getWritingsArrayInfo(
              userWritings.novelDocID
            )) as Array<getFirestoreWriting>
          ).sort((a, b) => b.dateCreated - a.dateCreated)
        : [];
      const scenario = userWritings.scenarioDocID
        ? (
            (await getWritingsArrayInfo(
              userWritings.scenarioDocID
            )) as Array<getFirestoreWriting>
          ).sort((a, b) => b.dateCreated - a.dateCreated)
        : [];
      setPoems(poems);
      setNovels(novel);
      setScenarioes(scenario);
      setTotalWritings(
        Array.prototype
          .concat(poems, novel, scenario)
          .sort((a, b) => b.dateCreated - a.dateCreated)
      );
    };
    const getContests = async (contestsDocID: {
      host: string[];
      participation: string[];
    }) => {
      const host = contestsDocID["host"];
      const participation = contestsDocID["participation"];

      const tmp: Array<any> = contestsDocID
        ? await getContetsArrayInfo(Array.prototype.concat(host, participation))
        : [];
      tmp && setTotalContests(tmp);
    };
    // Get user information
    getUserByUID(uid as string).then((res: any) => {
      const data = res.docs[0].data();
      setProfileOwnerInfo(data);
      setProfileImage(data.profileImg);
      getContests(data.contests);
      getUserWritings(data.uid).then((writings: any) => {
        setUserWritings(writings as getFirestoreUserWritings);
        getWritings(writings);
      });
      followersLength.current = data.followers.length;
      followingsLength.current = data.followings.length;
    });
  }, [uid]);

  // Get context user's information
  useEffect(() => {
    profileOwnerInfo.userEmail &&
      contextUser &&
      contextUser.uid &&
      getUserByUID(contextUser.uid).then((res: any) => {
        const data = res.docs[0].data();
        setUserInfo(data);
        setDoseUserFollow(data.followings.includes(profileOwnerInfo.uid));
      });
  }, [profileOwnerInfo, contextUser]);

  // Image Compress process
  const handleProfileImgOnChange = (event: any) => {
    const element = event.target.files[0];

    let qual = 0.45;

    if (element.size >= 4000000) {
      qual = 0.1;
    } else if (element.size >= 2000000) {
      qual = 0.2;
    } else if (element.size >= 1000000) {
      qual = 0.4;
    }

    new Compressor(element, {
      quality: qual,
      width: 800,
      height: 800,
      success(result: any) {
        const url = URL.createObjectURL(result);

        const formData = new FormData();
        formData.append("userUID", profileOwnerInfo.uid);
        formData.append("userEmail", profileOwnerInfo.userEmail);
        formData.append("file", result);

        axios
          .post(`https://ollim.herokuapp.com/updateProfileImage`, formData)
          .then((res) => {
            setAlarm(res.data);
            setTimeout(() => {
              setAlarm(["", "success", false]);
            }, 3000);
          });
        setProfileImage(url);
      },
      error(err) {
        console.log(err.message);
        return;
      },
    });
  };

  // Navigate to community
  const handleGoToCommunity = () => {
    navigator("/community");
  };

  const alarm = useSelector((state: RootState) => state.setAlarm.alarm);
  const alertVariants = {
    initial: {
      opacity: 0,
      y: -10,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -10,
    },
  };
  const options: Array<{ value: contestType; label: string }> = [
    { value: "PARTICIPATION", label: "참가" },
    { value: "HOST", label: "개최" },
    { value: "TOTAL", label: "전체" },
  ];
  return (
    <>
      {/* Followers Modal */}
      <AnimatePresence>
        {followersModal && profileOwnerInfo && (
          <motion.div
            animate={{
              backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
            }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 10000 }}
            className="font-noto fixed w-full h-full items-center justify-center top-0 left-0 flex"
            onClick={() => {
              setFollowersModal(false);
            }}
          >
            <div className="flex flex-col items-center w-1/4 h-1/2 bg-white py-5 rounded-lg GalaxyS20Ultra:w-1/2 GalaxyS20Ultra:w-4/5">
              <span className="text-xl font-bold text-gray-500 mb-5">
                팔로워
              </span>
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
                      setFollowersModal={setFollowersModal}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Followings Modal */}
      <AnimatePresence>
        {followingsModal && profileOwnerInfo && (
          <motion.div
            animate={{
              backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
            }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 10000 }}
            className="font-noto fixed w-full h-full items-center justify-center top-0 left-0 flex"
            onClick={() => {
              setFollowingsModal(false);
            }}
          >
            <div className="flex flex-col items-center w-1/4 h-1/2 bg-white py-5 rounded-lg GalaxyS20Ultra:w-4/5">
              <span className="text-xl font-bold text-gray-500 mb-5">
                팔로우
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex flex-col items-center w-full h-full px-10 gap-3 overflow-y-scroll"
              >
                {/* Followings list */}
                {!loading ? (
                  followings.map((data) => (
                    <FollowingRow
                      key={data.userEmail}
                      data={data}
                      setFollowingsModal={setFollowingsModal}
                    />
                  ))
                ) : (
                  // Skeleton
                  <FollowersFollowingsSkeleton
                    lengthProp={followingsLength.current}
                  />
                )}
                {/* Load more followings button */}
                {followingsKey.current < profileOwnerInfo.followings.length && (
                  <div
                    onClick={handleMoreFollowings}
                    className={`${
                      loading && "pointer-events-none"
                    } font-semibold text-sm shadow-inner cursor-pointer w-1/2 bg-white h-10 flex items-center justify-center rounded-xl text-gray-500`}
                  >
                    {!loading && "Load more..."}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      {profileOwnerInfo && profileImage ? (
        <div className="relative w-full h-full font-noto bg-opacity-30">
          {/* Header */}
          <Header userInfo={userInfo} />

          <div className="w-full flex">
            {/* Profile div */}
            <div className="w-full flex flex-col items-center justify-between">
              {/* Profile Image */}
              <div className="relative">
                {/* Profile Image Edit */}
                <label htmlFor="profileImg">
                  <div className="opacity-0 absolute flex items-center justify-center rounded-full w-full h-full cursor-pointer hover:opacity-20 hover:bg-black" />
                  <img
                    className="rounded-full w-64 h-64 shadow-xl object-cover"
                    src={profileImage}
                    alt="profile"
                  />
                </label>
                {contextUser.uid && contextUser.uid === uid && (
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
                {uid && contextUser && contextUser.uid !== uid && (
                  <button
                    onClick={() => {
                      setDoseUserFollow((origin) => {
                        origin
                          ? (followersLength.current -= 1)
                          : (followersLength.current += 1);
                        // https://ollim.herokuapp.com
                        axios.post(
                          `https://ollim.herokuapp.com/updateFollowing`,
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
                    className={`${
                      !doseUserFollow ? "bg-blue-400" : "bg-gray-300"
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
              {
                <div className="flex w-full items-center justify-center text-sm">
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-bold text-gray-400 font-Nanum_Gothic">
                      {totalWritings.length}
                    </span>
                    <span>글</span>
                  </div>
                  <div
                    onClick={() => {
                      handleMoreFollowers();
                      followersLength.current && setFollowersModal(true);
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
                      handleMoreFollowings();
                      followingsLength.current && setFollowingsModal(true);
                    }}
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="font-bold text-gray-400 font-Nanum_Gothic">
                      {followingsLength.current}
                    </span>
                    <span>팔로우</span>
                  </div>
                </div>
              }
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
                <motion.button
                  onClick={handleGoToCommunity}
                  whileHover={{ y: "-10%" }}
                  className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold"
                >
                  다른 작가의 작품보기
                </motion.button>
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
                        className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor ${
                          onWritingCategory === "NOVEL"
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
              <div className="flex items-center flex-col mb-20 w-2/3 GalaxyS20Ultra:mb-10">
                <div className="w-full grid grid-cols-3 items-center mb-10 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:space-y-10">
                  <span className="text-2xl font-bold justify-center col-start-2 w-full text-center">
                    올림 문예지
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
          </div>

          <div className="w-full h-1/3">
            <CustomNodeFlow />
          </div>
        </div>
      ) : (
        // Loading Page
        <div className="w-screen h-screen flex items-center justify-center bg-opacity-30">
          <img
            src="/logo/Ollim-logos_black.png"
            className="w-32 opacity-50"
            alt="loading"
          />
        </div>
      )}
    </>
  );
};

export default Mypage;
