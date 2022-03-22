import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MypageWriting from "../components/MypageWriting";
import UserContext from "../context/user";
import {
  getPoemArrayInfo,
  getUserWritings,
  getNovelArrayInfo,
  getScenarioArrayInfo,
  getUserByUID,
  getFollowersInfinite,
  getFollowingsInfinite,
} from "../services/firebase";
import Compressor from "compressorjs";
import { signOutAuth } from "../helpers/auth-OAuth2";
import NewWritingModal from "../components/NewWritingModal";
import CustomNodeFlow from "../diagram/RelationShipDiagram";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  alarmType,
  getFirestoreNovel,
  getFirestorePoem,
  getFirestoreScenario,
  getFirestoreUser,
  getFirestoreUserWritings,
} from "../type";
import { alarmAction, userInfoAction } from "../redux";
import { useNavigate, useParams } from "react-router-dom";

import Calendar from "../components/Calendar";
import { Alert } from "@mui/material";
import axios from "axios";
import FollowingRow from "../components/FollowingRow";
import FollowerRow from "../components/FollowerRow";
import FollowersFollowingsSkeleton from "../components/FollowersFollowingsSkeleton";
import Header from "../components/Header";

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

  // Indicates UID change
  const uidChangeDetect = useRef(0);

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
  // Category state
  const [onWritingCategory, setOnWritingCategory] = useState("TOTAL");
  // Does User Follow Profile Owner?
  const [doseUserFollow, setDoseUserFollow] = useState(false);
  // Profile owner's poems list
  const [poems, setPoems] = useState<Array<getFirestorePoem>>([]);
  // Profile owner's novels list
  const [novels, setNovels] = useState<Array<getFirestoreNovel>>([]);
  // Profile owner's scenarioes list
  const [scenarioes, setScenarioes] = useState<Array<getFirestoreScenario>>([]);
  // Profile owner's total writings list
  const [totalWritings, setTotalWritings] = useState<
    Array<getFirestoreScenario | getFirestoreNovel | getFirestorePoem>
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
    if (uidChangeDetect.current === 0) {
      uidChangeDetect.current += 1;
    } else {
      followingsLength.current = 0;
      followersLength.current = 0;
    }
  }, [uid]);

  // Get profileOwner's user info and user's writings info
  useEffect(() => {
    const getWritings = async (userWritings: getFirestoreUserWritings) => {
      const poems = userWritings.poemDocID
        ? await getPoemArrayInfo(userWritings.poemDocID)
        : [];
      const novel = userWritings.novelDocID
        ? await getNovelArrayInfo(userWritings.novelDocID)
        : [];
      const scenario = userWritings.scenarioDocID
        ? await getScenarioArrayInfo(userWritings.scenarioDocID)
        : [];

      setPoems(
        (poems as Array<getFirestorePoem>).sort(
          (a, b) => b.dateCreated - a.dateCreated
        )
      );
      setNovels(
        (novel as Array<getFirestoreNovel>).sort(
          (a, b) => b.dateCreated - a.dateCreated
        )
      );
      setScenarioes(
        (scenario as Array<getFirestoreScenario>).sort(
          (a, b) => b.dateCreated - a.dateCreated
        )
      );
      setTotalWritings(
        Array.prototype
          .concat(poems, novel, scenario)
          .sort((a, b) => b.dateCreated - a.dateCreated)
      );
    };

    if (uid) {
      getUserByUID(uid as string).then((res: any) => {
        const data = res.docs[0].data();
        setProfileOwnerInfo(data);
        setProfileImage(data.profileImg);
        getUserWritings(data.uid).then((writings: any) => {
          setUserWritings(writings as getFirestoreUserWritings);
          getWritings(writings);
        });
        followersLength.current = data.followers.length;
        followingsLength.current = data.followings.length;
      });
    } else {
      // If uid is undefined, go to context user's mypage
      getUserByUID(contextUser.uid).then((res: any) => {
        const data = res.docs[0].data();
        setProfileOwnerInfo(data);
        getUserWritings(data.uid).then((writings: any) => {
          setUserWritings(writings as getFirestoreUserWritings);
          getWritings(writings);
        });
        setProfileImage(data.profileImg);
        followersLength.current = data.followers.length;
        followingsLength.current = data.followings.length;
      });
    }
  }, [uid, contextUser.uid]);
  // edit()
  // Get context user's information
  useEffect(() => {
    profileOwnerInfo &&
      contextUser.uid &&
      getUserByUID(contextUser.uid).then((res: any) => {
        const data = res.docs[0].data();
        setUserInfo(data);
        setDoseUserFollow(data.followings.includes(profileOwnerInfo.userEmail));
      });
  }, [profileOwnerInfo, contextUser.uid]);

  // Image Compress process
  const handleFileOnChange = (event: any) => {
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
            <div className="flex flex-col items-center w-1/4 h-1/2 bg-white py-5 rounded-lg">
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
            <div className="flex flex-col items-center w-1/4 h-1/2 bg-white py-5 rounded-lg">
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

      {profileOwnerInfo && profileImage && userWritings && totalWritings ? (
        <div className="relative w-full font-noto bg-opacity-30">
          {/* New Writing Modal */}
          {newWritingModalOpen && (
            <NewWritingModal setNewWritingModalOpen={setNewWritingModalOpen} />
          )}

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
                <input
                  onChange={handleFileOnChange}
                  style={{ display: "none" }}
                  type="file"
                  name="profileImg"
                  id="profileImg"
                />
              </div>

              {/* Username */}
              <div className="flex items-center justify-center">
                <span className="text-2xl font-bold my-7 mr-3">
                  {profileOwnerInfo.username}
                </span>
                {uid && contextUser.uid !== uid && (
                  <button
                    onClick={() => {
                      setDoseUserFollow((origin) => {
                        origin
                          ? (followersLength.current -= 1)
                          : (followersLength.current += 1);
                        axios.post(
                          `https://ollim.herokuapp.com/updateFollowing`,
                          {
                            followingUserEmail: userInfo.userEmail,
                            followedUserEmail: profileOwnerInfo.userEmail,
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
                    팔로우
                  </button>
                )}
                {(!uid || contextUser.uid === uid) && (
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
              <div className="flex w-full items-center justify-center my-10">
                <motion.button
                  onClick={() => {
                    setNewWritingModalOpen(true);
                  }}
                  whileHover={{ y: "-10%" }}
                  className="mr-5 px-4 py-3 rounded-2xl bg-white shadow-md font-semibold"
                >
                  새 작품 추가
                </motion.button>
                <motion.button
                  onClick={handleGoToCommunity}
                  whileHover={{ y: "-10%" }}
                  className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold"
                >
                  다른 작가의 작품보기
                </motion.button>
              </div>

              {/* Calendar */}
              <Calendar totalCommits={userWritings.totalCommits} />

              {/* On writing */}
              <div className="flex items-center flex-col my-20 w-2/3">
                <div className="w-full grid grid-cols-3 items-center mb-20">
                  <span className="text-2xl font-bold justify-center col-start-2 w-full text-center">
                    작가의 글
                  </span>
                  <div className="grid grid-cols-4 col-start-3 gap-4 text-sm">
                    <button
                      className={`text-gray-700 font-semibold shadow border border-writingButton rounded-2xl hover:bg-wirtingButtonHover py-1 ${
                        onWritingCategory === "NOVEL" && "bg-writingButton"
                      }`}
                      onClick={() => {
                        setOnWritingCategory("NOVEL");
                      }}
                    >
                      소설
                    </button>
                    <button
                      className={`text-gray-700 font-semibold shadow border border-writingButton rounded-2xl hover:bg-wirtingButtonHover py-1 ${
                        onWritingCategory === "POEM" && "bg-writingButton"
                      }`}
                      onClick={() => {
                        setOnWritingCategory("POEM");
                      }}
                    >
                      시
                    </button>
                    <button
                      className={`text-gray-700 font-semibold shadow border border-writingButton rounded-2xl hover:bg-wirtingButtonHover py-1 ${
                        onWritingCategory === "SCENARIO" && "bg-writingButton"
                      }`}
                      onClick={() => {
                        setOnWritingCategory("SCENARIO");
                      }}
                    >
                      시나리오
                    </button>
                    <button
                      className={`text-gray-700 font-semibold shadow border border-writingButton rounded-2xl hover:bg-wirtingButtonHover py-1 ${
                        onWritingCategory === "TOTAL" && "bg-writingButton"
                      }`}
                      onClick={() => {
                        setOnWritingCategory("TOTAL");
                      }}
                    >
                      전체
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center justify-between w-full gap-5">
                  {onWritingCategory === "NOVEL" &&
                    novels &&
                    novels.map((data) => (
                      <MypageWriting key={data.dateCreated} data={data} />
                    ))}
                  {onWritingCategory === "POEM" &&
                    poems &&
                    poems.map((data) => (
                      <MypageWriting key={data.dateCreated} data={data} />
                    ))}
                  {onWritingCategory === "SCENARIO" &&
                    scenarioes &&
                    scenarioes.map((data) => (
                      <MypageWriting key={data.dateCreated} data={data} />
                    ))}
                  {onWritingCategory === "TOTAL" &&
                    totalWritings &&
                    totalWritings.map((data) => (
                      <MypageWriting key={data.dateCreated} data={data} />
                    ))}
                </div>
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
