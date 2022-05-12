import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../context/user";
import {
  getContestInfo,
  getUserByEmail,
  getUserByUID,
  getWritingInfo,
} from "../services/firebase";
import {
  getFirestoreUser,
  getFirestoreContest,
  contestTableType,
  getFirestoreWriting,
  contestWriting,
  genreMatching,
} from "../type";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { isFullScreenAction, widthSizeAction } from "../redux";
import { RootState } from "../redux/store";
import { Alert } from "@mui/material";
import Header from "../components/Header";
import axios from "axios";
import SpinningSvg from "../components/SpinningSvg";
import ContestSetting from "../components/ContestSetting";
import { css, cx } from "@emotion/css";
import SlateEditorContest from "../SlateEditor/SlateEditorContest";
import ContestWriting from "../writingComponents/ContestWriting";
import ContestParticipantModal from "../modals/ContestParticipantModal";

const Contest = () => {
  // User Info Variables
  const { contestDocID } = useParams();

  // ContextUser's information
  const { user: contextUser } = useContext(UserContext);
  const [contextUserInfo, setContextUserInfo] = useState<getFirestoreUser>(
    {} as getFirestoreUser
  );
  // Writing owner's information
  const [contestHostInfo, setContestHostInfo] = useState<getFirestoreUser>(
    {} as getFirestoreUser
  );
  // Contest Information
  const [contestInfo, setContestInfo] = useState<getFirestoreContest>(
    {} as getFirestoreContest
  );
  const [participateModalOpen, setParticipateModalOpen] = useState(false);
  const [numOfEntry, setNumOfEntry] = useState(0);
  // Table State
  const [table, setTable] = useState<contestTableType>("OVERVIEW");

  const [userVote, setUserVote] = useState("");

  // Synopsis State
  const [description, setDescription] = useState("");
  // Deadline
  const [deadline, setDeadline] = useState("");
  // Title
  const [title, setTitle] = useState("");

  // The work I submitted
  const [submittedWriting, setSubmittedWriting] = useState(
    {} as contestWriting
  );
  // Submitted writings contained others
  const [writingDocInfo, setWritingDocInfo] = useState<contestWriting[]>([]);

  // Browse submitted writing
  const [selectedWritingDocID, setSelectedWritingDocID] = useState("");
  const [selectedWritingInfo, setSelectedWritingInfo] =
    useState<getFirestoreWriting>({} as getFirestoreWriting);

  const dispatch = useAppDispatch();

  const navigator = useNavigate();

  const handleOnClick = (selectedWritingDocID: string) => {
    setSelectedWritingDocID(selectedWritingDocID);
    setTable("BROWSE");
  };
  // FullScreen redux setState
  const setIsFullScreen = useCallback(
    (isFullScreen) => {
      dispatch(isFullScreenAction.setIsFullScreen({ isFullScreen }));
    },
    [dispatch]
  );

  // alarm state
  // alarm[0] : alarm message, alarm[1] : alarm type, alarm[2] : alarm on, off
  const alarm = useAppSelector((state: RootState) => state.setAlarm.alarm);

  // Alert modal framer-motion variant
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

  // Server check state
  const [isServerClosedBtnDisable, setIsServerClosedDisable] = useState(false);
  const [isServerClosedComment, setIsServerClosedComment] =
    useState("서버 확인");

  // Check server is opened function
  const isOpened = () => {
    setIsServerClosedDisable(true);
    axios
      .get("https://ollim.herokuapp.com/isOpened")
      .then(() => {
        setIsServerClosedComment("서버 열림");
        setIsServerClosedDisable(false);
        setTimeout(() => {
          setIsServerClosedComment("서버 확인");
        }, 5000);
      })
      .catch(function (error) {
        setIsServerClosedComment("서버 닫힘");
        setIsServerClosedDisable(false);
        setTimeout(() => {
          setIsServerClosedComment("서버 확인");
        }, 5000);
        if (error.response) {
          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
          // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
          // Node.js의 http.ClientRequest 인스턴스입니다.
          console.log(error.request);
        } else {
          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  // Window width size
  const setWidthSize = (widthSize: number) => {
    dispatch(widthSizeAction.setWidthSize({ widthSize }));
  };
  const widthSize = useAppSelector(
    (state: RootState) => state.setWidthSize.widthSize
  );

  ////////////////////////////////////////////////////// useEffects /////////////////////////////////////////
  // useEffect to get context user's information
  useEffect(() => {
    if (contextUser && contextUser.email) {
      getUserByEmail(contextUser.email as string).then((res) => {
        setContextUserInfo(res.data() as getFirestoreUser);
      });
    }
  }, [contextUser]);

  // useEffect to get writing owner's information
  useEffect(() => {
    if (contestInfo && contestInfo.hostUID) {
      getUserByUID(contestInfo.hostUID).then((res: any) => {
        if (res.uid) {
          setContestHostInfo(res);
        }
      });
    }
  }, [contestInfo]);

  // Get writing info and set relevant states
  useEffect(() => {
    if (contestDocID) {
      getContestInfo(contestDocID).then((res: any) => {
        const data: getFirestoreContest = res.data();
        setNumOfEntry(Object.keys(data.writings).length);
        setWritingDocInfo(Object.values(data.writings));
        setDeadline(data.deadline);
        setDescription(data.description);
        setTitle(data.title);
        data.writings[contextUser.uid] &&
          setSubmittedWriting(data.writings[contextUser.uid]);
        Object.keys(data.whoVoted).includes(contextUser.uid) &&
          setUserVote(data.whoVoted[contextUser.uid]);
        setContestInfo(data);
      });
    }
  }, [table, contestDocID]);

  // Detect full screen change and Set fullscreen redux state
  useEffect(() => {
    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler, false);
    }
    function exitHandler() {
      if (!document.fullscreenElement) {
        // Run code on exit
        setIsFullScreen(false);
      }
    }
  }, []);

  // Browse writing
  useEffect(() => {
    if (selectedWritingDocID) {
      getWritingInfo(selectedWritingDocID).then((res: any) => {
        setSelectedWritingInfo(res);
      });
    }
  }, [selectedWritingDocID]);

  // Window size change detect
  useEffect(() => {
    window.onresize = () => {
      setWidthSize(window.innerWidth);
    };
  }, []);

  return (
    <>
      {contextUser.uid && contestInfo.genre && (
        <ContestParticipantModal
          uid={contextUser.uid}
          genre={contestInfo.genre}
          open={participateModalOpen}
          setOpen={setParticipateModalOpen}
          contestDocID={contestDocID as string}
          setSubmittedWriting={setSubmittedWriting}
          deadline={contestInfo.deadline}
          setNumOfEntry={setNumOfEntry}
        />
      )}
      {Object.keys(contestInfo).length > 0 &&
        contestDocID &&
        Object.keys(contestHostInfo).length > 0 && (
          <div className="w-full bg-opacity-30 relative writing-container font-noto">
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

            {/* Header */}
            <Header userInfo={contextUserInfo} />

            {/* Contest title Navigation bar*/}
            <div className="flex flex-col items-start px-20 GalaxyS20Ultra:px-10">
              <div className="flex flex-col items-start justify-center font-bold mb-10">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">{contestInfo.title}</span>
                  <span className="text-lg">·</span>
                  <span className="text-lg">백일장</span>
                </div>
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "#ada6a2" }}
                className="flex items-center space-x-5"
              >
                <span
                  className={`shadow material-icons cursor-pointer px-1 py-1 rounded-full hover:text-hoverSpanMenu ${
                    table === "OVERVIEW" &&
                    "text-hoverSpanMenu shadow-hoverSpanMenu"
                  }`}
                  onClick={() => {
                    setTable("OVERVIEW");
                  }}
                >
                  summarize
                </span>
                <AnimatePresence>
                  {Object.keys(selectedWritingInfo).length > 0 && (
                    <motion.span
                      animate={{ y: ["0%", "-20%", "0%", "-20%", "0%"] }}
                      className={`shadow material-icons cursor-pointer px-1 py-1 rounded-full hover:text-hoverSpanMenu ${
                        table === "BROWSE" &&
                        "text-hoverSpanMenu shadow-hoverSpanMenu"
                      }`}
                      onClick={() => {
                        setTable("BROWSE");
                      }}
                    >
                      play_circle
                    </motion.span>
                  )}
                </AnimatePresence>
                <span
                  onClick={() => {
                    setTable("VOTE");
                  }}
                  className={`shadow material-icons cursor-pointer px-1 py-1 rounded-full hover:text-hoverSpanMenu ${
                    table === "VOTE" &&
                    "text-hoverSpanMenu shadow-hoverSpanMenu"
                  }`}
                >
                  how_to_vote
                </span>
                {contestInfo.hostUID &&
                  contextUser.uid === contestInfo.hostUID && (
                    <>
                      <span
                        onClick={() => {
                          setTable("SETTING");
                        }}
                        className={`material-icons shadow cursor-pointer px-1 py-1 rounded-full ${
                          table === "SETTING" &&
                          "text-hoverSpanMenu shadow-hoverSpanMenu"
                        } hover:text-hoverSpanMenu`}
                      >
                        settings
                      </span>
                      <button
                        disabled={
                          isServerClosedBtnDisable ||
                          isServerClosedComment === "서버 열림" ||
                          isServerClosedComment === "서버 닫힘"
                        }
                        onClick={isOpened}
                        className={`text-white flex flex-col items-center justify-center cursor-pointer ml-5 h-8 rounded-2xl px-2
                            ${
                              isServerClosedComment === "서버 닫힘" &&
                              "bg-red-400"
                            }
                            ${
                              isServerClosedComment === "서버 열림" &&
                              "bg-green-400"
                            }
                            ${
                              isServerClosedComment === "서버 확인" &&
                              "bg-gray-400"
                            }
                        `}
                      >
                        {isServerClosedBtnDisable ? (
                          <SpinningSvg />
                        ) : (
                          isServerClosedComment
                        )}
                      </button>
                    </>
                  )}
              </div>
            </div>

            {/* Table OVERVIEW */}
            {table === "OVERVIEW" && (
              <div className="w-full flex flex-col items-start px-20 mt-10 GalaxyS20Ultra:px-10">
                <div className="mb-20 flex items-center w-2/3 justify-between">
                  <div className="flex flex-col GalaxyS20Ultra:w-full">
                    <span className="text-2xl font-bold mb-10">개최자</span>
                    <div
                      onClick={() => {
                        navigator(`/${contestInfo.hostUID}`);
                      }}
                      className="flex w-fit items-center justify-between cursor-pointer text-xl font-bold"
                    >
                      <img
                        className="w-7 h-7 object-cover rounded-full mr-2"
                        src={contestHostInfo.profileImg}
                        alt="writing owner"
                      />
                      <span>{contestHostInfo.username}</span>
                    </div>
                  </div>
                  <div className="flex flex-col GalaxyS20Ultra:w-full">
                    <div className="flex items-center mb-10">
                      <span className="text-2xl font-bold mr-3">마감 일자</span>
                      {new Date(contestInfo.deadline).getTime() >=
                      new Date().getTime() ? (
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                    <span>
                      {contestInfo.deadline.split("T")[0]}{" "}
                      {contestInfo.deadline.split("T")[1].split(".")[0]}
                    </span>
                  </div>
                  <div className="flex flex-col GalaxyS20Ultra:w-full">
                    <span className="text-2xl font-bold mb-10">제한 인원</span>
                    <span>
                      {numOfEntry}/{contestInfo.limitNumOfPeople}
                    </span>
                  </div>
                  <div className="flex flex-col GalaxyS20Ultra:w-full">
                    <span className="text-2xl font-bold mb-10">장르</span>
                    <span>{genreMatching[contestInfo.genre]}</span>
                  </div>
                </div>

                {/* Description div */}
                <div className="flex flex-col mb-20 w-2/3 GalaxyS20Ultra:w-full">
                  <span className="text-2xl font-bold mb-10">백일장 설명</span>
                  <textarea
                    value={contestInfo.description}
                    style={{ backgroundColor: "#FAF6F5" }}
                    readOnly
                    className="border-opacity-5 border-black shadow-lg px-3 py-3 resize-none border w-full h-72 overflow-y-scroll focus:outline-none"
                  >
                    {contestInfo.description}
                  </textarea>
                </div>

                {/* Participate, Submission div */}
                <div className="flex flex-col mb-20 w-2/3 GalaxyS20Ultra:w-full">
                  <span className="text-2xl font-bold mb-10 flex items-center">
                    {Object.keys(contestInfo.writings).includes(contextUser.uid)
                      ? "제출 목록"
                      : "참가하기"}
                    {!Object.keys(submittedWriting).length && (
                      <motion.span
                        whileHover={{ backgroundColor: "rgb(209 213 219)" }}
                        transition={{ ease: "linear" }}
                        onClick={() => {
                          setParticipateModalOpen(true);
                        }}
                        className="material-icons px-1 py-1 rounded-full cursor-pointer ml-2"
                      >
                        manage_search
                      </motion.span>
                    )}
                  </span>
                  {Object.keys(submittedWriting).length ? (
                    <ContestWriting
                      data={submittedWriting}
                      widthSize={widthSize}
                      handleOnClick={handleOnClick}
                      contestDocID={contestDocID}
                      contextUserUID={contextUser.uid}
                      deadline={deadline}
                      userVote={userVote}
                      setUserVote={setUserVote}
                    />
                  ) : (
                    <span className="font-bold text-xl text-gray-400">
                      제출한 작품이 여기에 표시됩니다
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Table BROWSE */}
            {table === "BROWSE" && selectedWritingInfo && (
              <div
                className={cx(
                  "w-full h-full mt-10 flex flex-col items-center justify-center pb-32 relative editor-container-browse",
                  css`
                    :fullscreen {
                      background-color: #e6ddda;
                      padding-bottom: 0;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                  `
                )}
              >
                <SlateEditorContest
                  writingDocID={selectedWritingDocID}
                  widthSize={widthSize}
                />
              </div>
            )}

            {/* Table VOTE */}
            {table === "VOTE" && (
              <div className="w-full flex flex-col items-start px-20 mt-10 GalaxyS20Ultra:px-10">
                <div className="flex mb-20 flex-col w-2/3 GalaxyS20Ultra:w-full">
                  <span className="text-2xl font-bold mb-10">투표</span>
                  <motion.div
                    layout
                    className="grid grid-cols-3 items-center justify-between w-full gap-5 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:overflow-y-scroll GalaxyS20Ultra:max-h-72 GalaxyS20Ultra:py-5 GalaxyS20Ultra:px-3"
                  >
                    {writingDocInfo.length ? (
                      writingDocInfo.map((val) => (
                        <ContestWriting
                          data={val}
                          widthSize={widthSize}
                          handleOnClick={handleOnClick}
                          contestDocID={contestDocID}
                          contextUserUID={contextUser.uid}
                          deadline={deadline}
                          userVote={userVote}
                          setUserVote={setUserVote}
                        />
                      ))
                    ) : (
                      <span>참가자가 없습니다</span>
                    )}
                  </motion.div>
                </div>
                {/* Synopsis div */}
                <div className="flex flex-col mb-20 w-2/3 GalaxyS20Ultra:w-full"></div>
              </div>
            )}

            {/* Table SETTING */}
            {table === "SETTING" && contestInfo.hostUID === contextUser.uid && (
              <ContestSetting
                contestInfo={contestInfo}
                contestDocID={contestDocID as string}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                deadline={deadline}
                setDeadline={setDeadline}
              />
            )}
          </div>
        )}
    </>
  );
};
export default Contest;
