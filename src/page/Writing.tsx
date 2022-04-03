import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../context/user";
import CustomNodeFlowRDOnly from "../diagram/RelationShipDiagramReadOnly";
import {
  getUserByEmail,
  getUserByUID,
  getWritingInfo,
} from "../services/firebase";
import {
  tableType,
  gerneType,
  disclosure,
  getFirestoreWriting,
  getFirestoreUser,
  toObjectElements,
  editorValue,
} from "../type";
import { cx, css } from "@emotion/css";
import SlateEditorRDOnly from "../SlateEditor/SlateEditorRDOnly";
import { useDispatch, useSelector } from "react-redux";
import {
  diagramAction,
  elementsAction,
  isFullScreenAction,
  widthSizeAction,
} from "../redux";
import { RootState } from "../redux/store";
import { Alert } from "@mui/material";
import { Elements } from "react-flow-renderer";
import { initialValue } from "../SlateEditor/utils";
import WritingSetting from "../components/WritingSetting";
import Header from "../components/Header";
import axios from "axios";
import SpinningSvg from "../components/SpinningSvg";
import WritingWrite from "../components/WritingWrite";

export const genreMatching = {
  NOVEL: "소설",
  POEM: "시",
  SCENARIO: "시나리오",
};

const Writing = () => {
  // User Info Variables
  const { uid, writingDocID, commentDocID } = useParams();

  // ContextUser's information
  const { user: contextUser } = useContext(UserContext);
  const [contextUserInfo, setContextUserInfo] = useState<getFirestoreUser>(
    {} as getFirestoreUser
  );
  // Writing owner's information
  const [writingOwnerInfo, setWritingOwnerInfo] = useState<getFirestoreUser>(
    {} as getFirestoreUser
  );
  // Writing information state
  const [writingInfo, setWritingInfo] = useState<getFirestoreWriting>(
    {} as getFirestoreWriting
  );

  // Table State
  const [table, setTable] = useState<tableType>("OVERVIEW");

  // Context user's writing like state
  const [likeWritingState, setLikeWritingState] = useState(false);

  // Writing informations that can be editted by user are assigned to useState ex. value, disclosure, synposis, title ...
  // Editor value
  const [value, setValue] = useState<editorValue[]>(initialValue);
  // Disclosure State
  const [disclosure, setDisclosure] = useState<disclosure>("PUBLIC");
  // Synopsis State
  const [synopsis, setSynopsis] = useState("");
  // Title
  const [title, setTitle] = useState("");
  // BGM
  const [bgm, setBgm] = useState<string>("");

  const dispatch = useDispatch();

  const navigator = useNavigate();

  // ReadOnly Diagram state
  const [readOnlyDiagram, setReadOnlyDiagram] = useState<toObjectElements>(
    {} as toObjectElements
  );

  //  Diagram redux state
  const diagram = useSelector((state: RootState) => state.setDiagram.diagram);
  const setDiagram = useCallback(
    (diagram: toObjectElements) => {
      dispatch(diagramAction.setDiagram({ diagram }));
    },
    [dispatch]
  );

  // Diagram's elements State
  const setElements = useCallback(
    (elements: Elements<any>) => {
      dispatch(elementsAction.setElements({ elements }));
    },
    [dispatch]
  );
  // FullScreen redux setState
  const setIsFullScreen = useCallback(
    (isFullScreen) => {
      dispatch(isFullScreenAction.setIsFullScreen({ isFullScreen }));
    },
    [dispatch]
  );
  // alarm state
  // alarm[0] : alarm message, alarm[1] : alarm type, alarm[2] : alarm on, off
  const alarm = useSelector((state: RootState) => state.setAlarm.alarm);
  const test = useRef(false);
  // useEffect to get context user's information
  useEffect(() => {
    if (contextUser && contextUser.email) {
      getUserByEmail(contextUser.email as string).then((res) => {
        setContextUserInfo(res.data() as getFirestoreUser);
      });
    }
    return () => {
      setElements([]);
      setDiagram({} as toObjectElements);
    };
  }, [contextUser]);

  // useEffect to get writing owner's information
  useEffect(() => {
    // copyPasteCommits()
    if (uid) {
      getUserByUID(uid).then((res) => {
        setWritingOwnerInfo(res.docs[0].data() as getFirestoreUser);
      });
    }
  }, [uid]);

  // Get writing info and set relevant states
  useEffect(() => {
    if (
      writingDocID &&
      (table === "OVERVIEW" || table === "WRITE" || table === "BROWSE")
    ) {
      getWritingInfo(writingDocID).then((res: any) => {
        if (res.genre !== "POEM") {
          // Poem doesn't have diagram, diagram's elements fields
          setDiagram(res.diagram as toObjectElements);
          setReadOnlyDiagram(res.diagram as toObjectElements);
          setElements(res.diagram.elements);
        } else {
          // Only poem has BGM field
          setBgm(res.bgm);
        }
        // All genres have below fields
        setWritingInfo(res as getFirestoreWriting);
        setSynopsis(res.synopsis);
        setDisclosure(res.disclosure);
        setTitle(res.title);
        contextUser &&
          contextUser.email &&
          setLikeWritingState(res.likes.includes(contextUser.email));
      });
    }
  }, [table, writingDocID]);

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

  // Handle like writing function
  const handleLikeWriting = () => {
    setLikeWritingState((origin) => {
      axios.post("https://ollim.herokuapp.com/updateLikeWriting", {
        likeUserEmail: contextUserInfo.userEmail,
        likedWritingDocID: writingDocID,
        likeWritingState: origin,
      });
      return !origin;
    });
  };

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
  const widthSize = useSelector(
    (state: RootState) => state.setWidthSize.widthSize
  );
  useEffect(() => {
    window.onresize = () => {
      setWidthSize(window.innerWidth);
    };
  }, []);
  useEffect(() => {
    commentDocID && navigator(`/writings/${uid}/${writingDocID}`);
  }, []);
  return (
    <>
      {Object.keys(writingInfo).length > 0 && uid && writingDocID && (
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
          {table !== "WRITE" && <Header userInfo={contextUserInfo} />}

          {/* Writing title, genre, owner's name,  */}
          <div className="flex flex-col items-start px-20 GalaxyS20Ultra:px-10">
            <div className="flex flex-col items-start justify-center font-bold mb-10">
              <div
                onClick={() => {
                  navigator(`/${writingOwnerInfo.uid}`);
                }}
                className="flex items-center justify-between mb-5 cursor-pointer"
              >
                <img
                  className="w-7 rounded-full mr-2"
                  src={writingOwnerInfo.profileImg}
                  alt="writing owner"
                />
                <span>{writingOwnerInfo.username}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">{writingInfo.title}</span>
                <span className="text-lg">·</span>
                <span className="text-lg">
                  {genreMatching[writingInfo.genre as gerneType]}
                </span>
                {contextUser && contextUser.uid && (
                  <>
                    <span className="text-lg">·</span>
                    <span
                      onClick={handleLikeWriting}
                      className={`cursor-pointer material-icons ${
                        likeWritingState ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      favorite
                    </span>
                  </>
                )}
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
              <span
                onClick={() => {
                  setTable("BROWSE");
                }}
                className={`shadow material-icons cursor-pointer px-1 py-1 rounded-full hover:text-hoverSpanMenu ${
                  table === "BROWSE" &&
                  "text-hoverSpanMenu shadow-hoverSpanMenu"
                }`}
              >
                play_circle
              </span>
              {uid && contextUser.uid === uid && (
                <>
                  {widthSize > 500 && (
                    <span
                      onClick={() => {
                        setTable("WRITE");
                      }}
                      className={`material-icons shadow cursor-pointer px-1 py-1 rounded-full ${
                        table === "WRITE" &&
                        "text-hoverSpanMenu shadow-hoverSpanMenu"
                      } hover:text-hoverSpanMenu`}
                    >
                      drive_file_rename_outline
                    </span>
                  )}
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
          {table === "OVERVIEW" &&
            (writingInfo.genre === "POEM" ? (
              <div className="w-full h-full flex flex-col items-start px-20 mt-20 GalaxyS20Ultra:px-10">
                {/* Synopsis div */}
                <div className="flex flex-col w-2/3 GalaxyS20Ultra:w-full">
                  <span className="text-2xl font-bold mb-10">여는 말</span>
                  <textarea
                    value={writingInfo.synopsis}
                    style={{ backgroundColor: "#FAF6F5" }}
                    disabled
                    className="border-opacity-5 border-black shadow-lg px-3 py-3 resize-none border w-full h-72 overflow-y-scroll focus:outline-none"
                  >
                    {writingInfo.synopsis}
                  </textarea>
                </div>
              </div>
            ) : (
              diagram && (
                <div className="w-full flex flex-col items-start px-20 mt-20 GalaxyS20Ultra:px-10">
                  {/* Synopsis div */}
                  <div className="flex flex-col w-2/3 GalaxyS20Ultra:w-full">
                    <span className="text-2xl font-bold mb-10">시놉시스</span>
                    <textarea
                      value={writingInfo.synopsis}
                      style={{ backgroundColor: "#FAF6F5" }}
                      disabled
                      className="border-opacity-5 border-black shadow-lg px-3 py-3 resize-none border w-full h-72 overflow-y-scroll focus:outline-none"
                    >
                      {writingInfo.synopsis}
                    </textarea>
                  </div>
                  {/* diagram div */}
                  <div className="flex flex-col w-2/3 my-20 GalaxyS20Ultra:w-full">
                    <span className="text-2xl font-bold mb-10">
                      인물 관계도
                    </span>
                    <CustomNodeFlowRDOnly diagram={readOnlyDiagram} />
                  </div>
                </div>
              )
            ))}

          {/* Table WRITE */}
          {table === "WRITE" && uid === contextUser.uid && (
            <WritingWrite
              genre={writingInfo.genre}
              value={value}
              setValue={setValue}
              writingDocID={writingDocID}
            />
          )}

          {/* Table BROWSE */}
          {table === "BROWSE" && (
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
              <SlateEditorRDOnly
                writingDocID={writingDocID}
                contextUserInfo={contextUserInfo}
                widthSize={widthSize}
                alarmCommentDocID={
                  commentDocID === undefined ? "" : commentDocID
                }
                test={test}
              />
            </div>
          )}

          {/* Table SETTING */}
          {writingDocID &&
            table === "SETTING" &&
            writingInfo.userUID === contextUser.uid && (
              <WritingSetting
                writingInfo={writingInfo}
                title={title}
                setTitle={setTitle}
                synopsis={synopsis}
                setSynopsis={setSynopsis}
                disclosure={disclosure}
                setDisclosure={setDisclosure}
                writingDocID={writingDocID}
                bgm={bgm}
                setBgm={setBgm}
              />
            )}
        </div>
      )}
    </>
  );
};

export default Writing;
