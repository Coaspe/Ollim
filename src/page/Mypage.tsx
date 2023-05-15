import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import MypageWriting from "../components/writing/MypageWriting";
import UserContext from "../context/user";

import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { RootState } from "../redux/store";

import { userInfoAction, widthSizeAction } from "../redux";
import { useParams } from "react-router-dom";

import Calendar from "../components/calendar/Calendar";
import { Alert, Tooltip } from "@mui/material";

import Header from "../components/header/Header";

import useGetWritings from "../hooks/useGetWritings";
import useGetProfileOwnerinfo from "../hooks/useGetProfileOwnerInfo"
import MypageSkeleton from "../components/skeleton/MypageSkeleton";

import { alertVariants } from "../constants";
import TestAccountModal from "../components/modals/TestAccountModal";
import NewWritingModal from "../components/modals/NewWritingModal";
import NewContestModal from "../components/modals/NewContestModal";
import Profile from "../components/mypage/Profile";
import { getUserByUID } from "../services/firebase";
import { getFirestoreUser } from "../type";

const Mypage = () => {
  // Profile owner's uid
  const { uid } = useParams();

  const [profileImage, setProfileImage] = useState("");

  // Recommands users for test account.
  const [testModalOpen, setTestModalOpen] = useState(false);

  // Context user information as firebase.User
  const { user: contextUser } = useContext(UserContext);

  // Writing category state
  const [onWritingCategory, setOnWritingCategory] = useState("TOTAL");

  const dispatch = useAppDispatch();

  // Context user information as getFirestoreUser
  const userInfo = useAppSelector(
    (state: RootState) => state.setUserInfo.userInfo
  );
  const setUserInfo = (userInfo: getFirestoreUser) => {
    dispatch(userInfoAction.setUserInfo({ userInfo }));
  };

  // Window width size
  const widthSize = useAppSelector(
    (state: RootState) => state.setWidthSize.widthSize
  );
  const setWidthSize = (widthSize: number) => {
    dispatch(widthSizeAction.setWidthSize({ widthSize }));
  };

  const alarm = useAppSelector((state: RootState) => state.setAlarm.alarm);

  // Window size changed detect!
  useEffect(() => {
    window.onresize = () => {
      setWidthSize(window.innerWidth);
    };
  }, []);

  // Get contextUser information as getFirestoreUser and set userInfo redux state 
  useEffect(() => {
    const initContextUser = async () => {
      if (contextUser && Object.keys(contextUser).length) {
        // Check test account
        if (contextUser.uid === "DkWmsoSIi5VJYdb6uNueeIFbP8O2"
          && !window.localStorage.getItem("TEST_ACCOUNT")) {
          setTestModalOpen(true)
          window.localStorage.setItem("TEST_ACCOUNT", "TRUE")
        }
        const contextUserInfo = await getUserByUID(contextUser.uid)
        if (contextUserInfo.uid) {
          setUserInfo(contextUserInfo);
        }
      }
    }
    initContextUser()
  }, [contextUser, userInfo])

  const {
    poems,
    novels,
    scenarioes,
    totalWritings,
    userWritings,
    writingsLoading,
  } = useGetWritings(uid, contextUser && contextUser.uid);

  const {
    profileOwnerInfo,
    followerUIDs,
    followingUIDs,
    totalContests,
    setFollowerUIDs,
  } = useGetProfileOwnerinfo(uid, setProfileImage)

  // New Writing modal state
  const [newWritingModalOpen, setNewWritingModalOpen] = useState(false);
  // New Contest modal state
  const [newContestModalOpen, setNewContestModalOpen] = useState(false);
  useEffect(() => {
    console.log(totalWritings);
  }, [totalWritings])
  return (
    <>
      {
        contextUser && contextUser.email === 'achoe628@naver.com' && testModalOpen && (
          <TestAccountModal userUIDs={followingUIDs} setModalOpen={setTestModalOpen}
          />
        )
      }
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
      {/* New Contest Modal */}
      {newContestModalOpen && (
        <NewContestModal setNewContestModalOpen={setNewContestModalOpen} />
      )}
      {/* Header */}
      {<Header userInfo={userInfo} />}
      {profileOwnerInfo && !writingsLoading ? (
        <div className="font-noto w-full flex flex-col items-center justify-between">

          {/* Main Profile */}
          <Profile uid={uid} profileImage={profileImage} profileOwnerInfo={profileOwnerInfo} setProfileImage={setProfileImage} followers={followerUIDs} followings={followingUIDs} totalContests={totalContests} setFollowers={setFollowerUIDs} writingsLength={totalWritings.length} />

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
            {/* {contextUser &&
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
              )} */}
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
                    key={data.writingDocID}
                    data={data}
                    widthSize={widthSize}
                  />
                ))}
              {onWritingCategory === "POEM" &&
                poems &&
                poems.map((data) => (
                  <MypageWriting
                    key={data.writingDocID}
                    data={data}
                    widthSize={widthSize}
                  />
                ))}
              {onWritingCategory === "SCENARIO" &&
                scenarioes &&
                scenarioes.map((data) => (
                  <MypageWriting
                    key={data.writingDocID}
                    data={data}
                    widthSize={widthSize}
                  />
                ))}
              {onWritingCategory === "TOTAL" &&
                totalWritings &&
                totalWritings.map((data) => {
                  return (
                    <MypageWriting
                      key={data.writingDocID}
                      data={data}
                      widthSize={widthSize}
                    />
                  );
                })}
            </motion.div>
          </div>

          {/* Contest */}
          {/* <div className="flex px-5 items-center flex-col mb-20 w-2/3 GalaxyS20Ultra:mb-10">
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
          </div> */}
        </div>
      ) : (
        <MypageSkeleton widthSize={widthSize} />
      )
      }
    </>
  );
};

export default Mypage;
