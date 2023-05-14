import { Tooltip } from "@mui/material";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import DiagramNewWritings from "../diagram/RelationShipDiagramNewWritings";
import { alarmAction, elementsAction } from "../../redux";
import { RootState } from "../../redux/store";
import { addWritingArg, genre, page, disclosure, alarmType } from "../../type";
interface NewWritingProps {
  setNewWritingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewWritingModal: React.FC<NewWritingProps> = ({
  setNewWritingModalOpen,
}) => {
  const [page, setPage] = useState<page>("MAIN");
  const [genrn, setGenrn] = useState<genre>("NOVEL");
  const [genrnError, setGenrnError] = useState(false);
  const [firstCollectionElementError, setFirstCollectionElementError] =
    useState(false);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [synopsis, setSynopsis] = useState("");
  const [disclosure, setDisclosure] = useState<disclosure>("PUBLIC");
  const [isCollection, setIsCollection] = useState(false);
  const [firstCollectionElementTitle, setFirstCollectionElementTitle] =
    useState("");

  const dispatch = useAppDispatch();

  const setElements = useCallback(
    (elements) => {
      dispatch(elementsAction.setElements({ elements: elements }));
    },
    [dispatch]
  );

  const diagram = useAppSelector(
    (state: RootState) => state.setDiagram.diagram
  );

  const userInfo = useAppSelector(
    (state: RootState) => state.setUserInfo.userInfo
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
      setElements([]);
    };
  }, []);

  const handleGenrnError = () => {
    genrnError && setGenrnError(false);
  };
  const handleTitleError = () => {
    titleError && setTitleError(false);
  };
  const handleFirstCollectionElementError = () => {
    firstCollectionElementError && setFirstCollectionElementError(false);
  };
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };
  const handleAddWriting = (data: addWritingArg, genre: string) => {
    axios
      .post(`https://ollim.onrender.com/addWriting`, {
        data: JSON.stringify(data),
        genre: genre.toLocaleUpperCase(),
      })
      .then((res) => {
        setAlarm(res.data);
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 3000);
        if (res.data[1] === "success") {
          window.location.reload();
        }
      });
  };

  return (
    <motion.div
      onClick={() => {
        setNewWritingModalOpen(false);
      }}
      className="font-noto flex items-center justify-center z-20 fixed w-full h-full"
      animate={{
        backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
      }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      {/* First page: Decide Gerne, Title, Synopsis*/}
      {page === "MAIN" && userInfo && (
        <motion.div
          animate={{
            scale: ["80%", "100%"],
            opacity: ["0%", "100%"],
          }}
          transition={{
            duration: 0.2,
            type: "spring",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ backgroundColor: "#faf6f5" }}
          className="relative w-1/2 h-3/4 flex flex-col items-center justify-center rounded-xl"
        >
          {/* right arrow (scenario, novel) or confirm svg (poem) */}
          {genrn !== "POEM" ? (
            <motion.svg
              whileHover={{ y: "-10%" }}
              x="0px"
              y="0px"
              className={`w-8 absolute top-5 right-5 cursor-pointer`}
              onClick={() => {
                if (isCollection) {
                  if (!title && !firstCollectionElementTitle) {
                    setTitleError(true);
                    setFirstCollectionElementError(true);
                  } else if (!title) {
                    setTitleError(true);
                    handleFirstCollectionElementError();
                  } else if (!firstCollectionElementTitle) {
                    setFirstCollectionElementError(true);
                    handleTitleError();
                  } else {
                    setPage("DIAGRAM");
                  }
                } else {
                  !title ? setTitleError(true) : setPage("DIAGRAM");
                }
                !isCollection
                  ? !titleError && !genrnError && setPage("DIAGRAM")
                  : !titleError &&
                  !genrnError &&
                  !firstCollectionElementError &&
                  setPage("DIAGRAM");
              }}
              viewBox="0 0 50 50"
            >
              <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z" />
              <path d="M24.7 34.7l-1.4-1.4 8.3-8.3-8.3-8.3 1.4-1.4 9.7 9.7z" />
              <path d="M16 24h17v2H16z" />
            </motion.svg>
          ) : (
            <motion.svg
              whileHover={{ y: "-10%" }}
              x="0px"
              y="0px"
              className={`w-8 absolute top-5 right-5 cursor-pointer`}
              viewBox="0 0 50 50"
              onClick={() => {
                if (!genrn && !title) {
                  setGenrnError(true);
                  setTitleError(true);
                } else if (!genrn) {
                  setGenrnError(true);
                  handleTitleError();
                } else if (!title) {
                  setTitleError(true);
                  handleGenrnError();
                } else {
                  // Send firestore post
                  let data: addWritingArg = {
                    userUID: userInfo.uid,
                    userEmail: userInfo.userEmail,
                    collection: {
                      1: {
                        title: firstCollectionElementTitle,
                        tempSave: {},
                        commits: [],
                      },
                    },
                    isCollection,
                    title,
                    disclosure,
                    synopsis,
                  };

                  handleAddWriting(data, "Poem");
                  setNewWritingModalOpen(false);
                }
              }}
            >
              <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z" />
              <path d="M23 32.4l-8.7-8.7 1.4-1.4 7.3 7.3 11.3-11.3 1.4 1.4z" />
            </motion.svg>
          )}
          <div className="w-3/4 h-5/6 flex flex-col items-center justify-between">
            {/* Genrn, isCollection, Disclosure Div */}
            <div className="flex w-full h-1/3 items-center justify-between">
              {/* Genrn div */}
              <div className="flex flex-col items-start w-1/4 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">장르</span>
                  {genrnError && (
                    <motion.span
                      className="text-sm ml-2 font-bold text-red-400"
                      animate={{ opacity: [0, 1] }}
                      transition={{ duration: 0.1 }}
                    >
                      장르를 선택해주세요!
                    </motion.span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-5 w-full">
                  <Tooltip title="소설" placement="top" arrow>
                    <span
                      onClick={() => {
                        setGenrn("NOVEL");
                        handleGenrnError();
                      }}
                      style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                      className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor ${genrn === "NOVEL"
                        ? "text-slate-700 bg-genreSelectedBG"
                        : "text-slate-400"
                        }`}
                    >
                      menu_book
                    </span>
                  </Tooltip>
                  <Tooltip title="시" placement="top" arrow>
                    <span
                      onClick={() => {
                        setGenrn("POEM");
                        handleGenrnError();
                      }}
                      style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                      className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor ${genrn === "POEM"
                        ? "text-slate-700 bg-genreSelectedBG"
                        : "text-slate-400"
                        }`}
                    >
                      history_edu
                    </span>
                  </Tooltip>
                  <Tooltip title="시나리오" placement="top" arrow>
                    <span
                      onClick={() => {
                        setGenrn("SCENARIO");
                        handleGenrnError();
                      }}
                      style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                      className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor ${genrn === "SCENARIO"
                        ? "text-slate-700 bg-genreSelectedBG"
                        : "text-slate-400"
                        }`}
                    >
                      adf_scanner
                    </span>
                  </Tooltip>
                </div>
              </div>

              {/* Is Collection? */}
              <div className="flex flex-col items-start w-1/4 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">
                    {genrn !== "POEM" ? "장 구분" : "시 집"}
                  </span>
                </div>
                <div className="flex items-center mt-5 w-full justify-between">
                  <span
                    onClick={() => {
                      setIsCollection(true);
                    }}
                    style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                    className={`border rounded-full block py-2 px-2 cursor-pointer font-bold material-icons hover:text-slate-500 ${isCollection === true
                      ? "text-slate-700 bg-genreSelectedBG"
                      : "text-slate-400"
                      }`}
                  >
                    done
                  </span>
                  <span
                    onClick={() => {
                      setIsCollection(false);
                    }}
                    style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                    className={`border rounded-full block py-2 px-2 cursor-pointer font-bold material-icons hover:text-slate-500 ${isCollection === false
                      ? "text-slate-700 bg-genreSelectedBG"
                      : "text-slate-400"
                      }`}
                  >
                    close
                  </span>
                </div>
              </div>

              {/* Disclosure */}
              <div className="flex flex-col items-start w-1/4 h-full">
                <span className="text-xl font-bold">공개 범위</span>
                <div className="w-full flex items-center mt-5 justify-between">
                  <Tooltip title="모두" placement="top" arrow>
                    <button
                      style={{ borderColor: "#e4d0ca" }}
                      className={`group text-md font-bold border py-2 px-2 rounded-full hover:bg-hoverBGColor ${disclosure === "PUBLIC" && "bg-genreSelectedBG"
                        }`}
                      onClick={() => {
                        setDisclosure("PUBLIC");
                      }}
                    >
                      <svg
                        className={`w-6 fill-slate-400 group-hover:fill-slate-500 ${disclosure === "PUBLIC" && "fill-slate-700"
                          }`}
                        viewBox="0 0 16 16"
                      >
                        <path d="M8.5 1a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm4.894 4a5.527 5.527 0 0 0-3.053-2.676c.444.84.765 1.74.953 2.676h2.1zm.582 2.995A5.11 5.11 0 0 0 14 7.5a5.464 5.464 0 0 0-.213-1.5h-2.342c.032.331.055.664.055 1a10.114 10.114 0 0 1-.206 2h2.493c.095-.329.158-.665.19-1.005zm-3.535 0l.006-.051A9.04 9.04 0 0 0 10.5 7a8.994 8.994 0 0 0-.076-1H6.576A8.82 8.82 0 0 0 6.5 7a8.98 8.98 0 0 0 .233 2h3.534c.077-.332.135-.667.174-1.005zM10.249 5a8.974 8.974 0 0 0-1.255-2.97C8.83 2.016 8.666 2 8.5 2a3.62 3.62 0 0 0-.312.015l-.182.015L8 2.04A8.97 8.97 0 0 0 6.751 5h3.498zM5.706 5a9.959 9.959 0 0 1 .966-2.681A5.527 5.527 0 0 0 3.606 5h2.1zM3.213 6A5.48 5.48 0 0 0 3 7.5 5.48 5.48 0 0 0 3.213 9h2.493A10.016 10.016 0 0 1 5.5 7c0-.336.023-.669.055-1H3.213zm2.754 4h-2.36a5.515 5.515 0 0 0 3.819 2.893A10.023 10.023 0 0 1 5.967 10zM8.5 12.644A8.942 8.942 0 0 0 9.978 10H7.022A8.943 8.943 0 0 0 8.5 12.644zM11.033 10a10.024 10.024 0 0 1-1.459 2.893A5.517 5.517 0 0 0 13.393 10h-2.36z" />
                      </svg>
                    </button>
                  </Tooltip>
                  <Tooltip title="비공개" placement="top" arrow>
                    <button
                      style={{ borderColor: "#e4d0ca" }}
                      className={`group text-md font-bold border py-2 px-2 rounded-full hover:bg-hoverBGColor ${disclosure === "PRIVATE" && "bg-genreSelectedBG"
                        }`}
                      onClick={() => {
                        setDisclosure("PRIVATE");
                      }}
                    >
                      <svg
                        className={`w-6 fill-slate-400 group-hover:fill-slate-500 ${disclosure === "PRIVATE" && "fill-slate-700"
                          }`}
                        viewBox="0 0 24 24"
                      >
                        <g>
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M18 8h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2V7a6 6 0 1 1 12 0v1zm-2 0V7a4 4 0 1 0-8 0v1h8zm-9 3v2h2v-2H7zm0 3v2h2v-2H7zm0 3v2h2v-2H7z" />
                        </g>
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Title, First element's title div */}
            <div className="flex w-full h-1/3 items-center justify-between">
              {/* Title */}
              <div className="flex flex-col items-start w-5/12 h-full">
                <div className="flex items-center">
                  <span className="text-xl font-bold">제목</span>
                  {titleError && (
                    <motion.span
                      className="text-sm ml-2 font-bold text-red-400"
                      animate={{ opacity: [0, 1] }}
                      transition={{ duration: 0.1 }}
                    >
                      제목을 입력해주세요!
                    </motion.span>
                  )}
                </div>
                <input
                  style={{ borderColor: "#e4d0ca" }}
                  className="text-lg font-md border-2 py-2 px-3 mt-5 rounded-xl w-full placeholder:italic"
                  placeholder="제목을 입력해주세요."
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    e.target.value && handleTitleError();
                  }}
                />
              </div>

              {/*  First element's title */}
              <AnimatePresence>
                {isCollection && (
                  <motion.div
                    animate={{ y: ["-5%", "0%"], opacity: ["0%", "100%"] }}
                    exit={{ y: ["0%", "-5%"], opacity: ["100%", "0%"] }}
                    transition={{ duration: 0.1 }}
                    className="flex flex-col items-start w-5/12 h-full"
                  >
                    <div className="flex items-center">
                      <span className="text-xl font-bold">
                        {genrn !== "POEM" ? "첫 장의 제목" : "첫 시의 제목"}
                      </span>
                      {firstCollectionElementError && (
                        <motion.span
                          className="text-sm ml-2 font-bold text-red-400"
                          animate={{ opacity: [0, 1] }}
                          transition={{ duration: 0.1 }}
                        >
                          제목을 입력해주세요!
                        </motion.span>
                      )}
                    </div>
                    <input
                      style={{ borderColor: "#e4d0ca" }}
                      className="text-lg font-md border-2 py-2 px-3 mt-5 rounded-xl w-full placeholder:italic"
                      placeholder="제목을 입력해주세요."
                      type="text"
                      value={firstCollectionElementTitle}
                      onChange={(e) => {
                        setFirstCollectionElementTitle(e.target.value);
                        e.target.value && handleFirstCollectionElementError();
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Opening article div */}
            <div className="flex flex-col items-start w-full h-1/3">
              <span className="text-xl font-bold">
                {genrn === "POEM" ? "여는 말" : "시놉시스"}
              </span>
              <textarea
                style={{ borderColor: "#e4d0ca" }}
                className="resize-none border-2 pt-2 px-3 mt-5 rounded-xl h-full w-full italic"
                placeholder={
                  genrn === "POEM"
                    ? "전시될 여는 말을 서술해주세요."
                    : "전시될 시놉시스를 간략하게 서술해주세요."
                }
                value={synopsis}
                spellCheck="false"
                onChange={(e) => {
                  setSynopsis(e.target.value);
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* (if Novel and Scenario) Second page: Decide Characters relationships diagram */}
      {page === "DIAGRAM" && (genrn === "SCENARIO" || genrn === "NOVEL") && (
        <div
          style={{ backgroundColor: "#faf6f5" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="relative w-1/2 h-3/4 py-5 px-5 flex flex-col items-center rounded-xl"
        >
          {/* arrow div */}
          <div className="absolute top-5 right-5 z-20 flex items-center justify-between">
            {/* left arrow */}
            <motion.svg
              whileHover={{ y: "-10%" }}
              x="0px"
              y="0px"
              className={`w-8 cursor-pointer`}
              onClick={() => {
                setPage("MAIN");
              }}
              viewBox="0 0 50 50"
            >
              <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z" />
              <path d="M25.3 34.7L15.6 25l9.7-9.7 1.4 1.4-8.3 8.3 8.3 8.3z" />
              <path d="M17 24h17v2H17z" />
            </motion.svg>

            {/* right arrow */}
            <motion.svg
              whileHover={{ y: "-10%" }}
              x="0px"
              y="0px"
              className={`w-8 cursor-pointer`}
              onClick={() => {
                const data: addWritingArg = {
                  collection: {
                    1: {
                      title: firstCollectionElementTitle,
                      tempSave: {},
                      commits: [],
                    },
                  },
                  isCollection,
                  userEmail: userInfo.userEmail,
                  synopsis,
                  title,
                  userUID: userInfo.uid,
                  diagram:
                    Object.keys(diagram).length === 0
                      ? {
                        elements: [],
                        position: [0, 0],
                        zoom: 1.5,
                      }
                      : diagram,
                  disclosure,
                };
                genrn === "NOVEL"
                  ? handleAddWriting(data, "Novel")
                  : handleAddWriting(data, "Scenario");
                setNewWritingModalOpen(false);
              }}
              viewBox="0 0 50 50"
            >
              <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z" />
              <path d="M23 32.4l-8.7-8.7 1.4-1.4 7.3 7.3 11.3-11.3 1.4 1.4z" />
            </motion.svg>
          </div>

          {/* Characters relationships diagram*/}
          <span className="abosolute left-1/2 top-5 font-bold text-2xl">
            인물관계도
          </span>
          <DiagramNewWritings />
        </div>
      )}

      {/* {page === 3 &&} */}
    </motion.div>
  );
};

export default NewWritingModal;
