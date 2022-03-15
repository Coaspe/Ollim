import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { Editor, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Toolbar } from "./components";
import { cx, css } from "@emotion/css";
import { alarmAction } from "../redux";
import { getWritingInfo } from "../services/firebase";
import { motion, AnimatePresence } from "framer-motion";
import DiagramWrite from "../diagram/RelationShipDiagram";
import {
  Leaf,
  toggleMark,
  FontSize,
  FontStyle,
  SvgButton,
  DictButton,
  MarkButton,
} from "./utils";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Tooltip } from "@mui/material";
import "../style/Slate.css";
import ResizeObserver from "rc-resize-observer";
import ParagraphWithoutNum from "./paragraphWithoutNum";
import SpinningSvg from "../components/SpinningSvg";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+d": "diagram",
  "mod+s": "tempSave",
};

const SlateEditor = ({
  openDiagram,
  setOpenDiagram,
  writingDocID,
  genre,
  value,
  setValue,
  setSlateCompareValue,
  setSlateCompareOpen,
  setSelectedCompareKey,
  selectedCompareKey,
  isFullScreen,
  setIsFullScreen,
}) => {
  const [percentage, setPercentage] = useState(0);
  const [tempSaveModal, setTempSaveModal] = useState(false);
  const dispatch = useDispatch();
  const isInitialMount = useRef(0);

  // Writing Info loading state
  const [loading, setLoading] = useState(false);

  // Commit sccess
  const commitSuccess = useRef(false);

  const [commitButtonEnable, setCommitButtonEnable] = useState(true);
  const [temporarySaveButtonEnable, setTemporarySaveButtonEnable] =
    useState(true);

  // Render Slate leaf nodes
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Selected words to search for dictionary
  const [selected, setSelected] = useState("");

  // Overall Writing Information
  const [writingInfo, setWritingInfo] = useState({});

  // Diagram open state
  const [openModal, setOpenModal] = useState(false);
  // Memo open state
  const [openMemo, setOpenMemo] = useState(false);

  const [memo, setMemo] = useState(
    localStorage.getItem(`${writingDocID}_memo`)
  );
  // Selected commit key
  const [selectedKey, setSelectedKey] = useState("");

  // commit modal
  const [openCommitModal, setOpenCommitModal] = useState(false);
  const [commitDescription, setCommitDescription] = useState("");
  const [tempSaveState, setTempSaveState] = useState({});

  // Compare modal
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const [openNewCollectionElementModal, setOpenNewCollectionElementModal] =
    useState(false);
  const [nowCollectionNum, setNowCollectionNum] = useState(0);
  const [collectionNumArray, setCollectionNumArray] = useState([]);
  const [newCollectionElementTitle, setNewCollectionElementTitle] =
    useState("");
  const [changeCollectionElementModal, setChangeCollectionElementModal] =
    useState(false);
  const loadTemp = useRef(true);
  // Render Slate element
  const renderElement = ({ element, attributes, children }) => {
    const elementKey = ReactEditor.findKey(editor, element);
    let target = 0;
    for (let i = 0; i < value.length; i++) {
      const element = ReactEditor.findKey(editor, value[i]);
      if (elementKey === element) {
        target = i;
        break;
      }
    }
    return (
      <ParagraphWithoutNum
        element={element}
        attributes={attributes}
        children={children}
        lineNum={target}
      />
    );
  };

  // Alarm dispatch fucntion
  const setAlarm = (alarm) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };
  // https://ollim.herokuapp.com
  // Handle Save fuctions
  const handleRequestTempSave = () => {
    const date = new Date().getTime();
    axios
      .post(`https://ollim.herokuapp.com/temporarySave`, {
        contents: JSON.stringify(value),
        writingDocID,
        genre: writingInfo.genre,
        collectionNum: nowCollectionNum,
      })
      .then((res) => {
        setTemporarySaveButtonEnable(true);
        setAlarm(res.data);
        res.data[1] === "success" &&
          setTempSaveState({ date, contents: value });
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 2000);
      });
  };
  // Handle Remove Temporary save function
  const handleRequestTempSaveRemove = () => {
    axios
      .post(`https://ollim.herokuapp.com/removeTempSave`, {
        writingDocID,
        genre: writingInfo.genre,
        collectionNum: nowCollectionNum,
      })
      .then((res) => {
        setTemporarySaveButtonEnable(true);
        setAlarm(res.data);
        res.data[1] === "success" && setTempSaveState({});
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 2000);
      });
  };
  // Handle Commit function
  const handleRequestCommit = () => {
    axios
      .post("https://ollim.herokuapp.com/commit", {
        contents: JSON.stringify(value),
        writingDocID,
        userUID: writingInfo.userUID,
        memo: commitDescription,
        genre: writingInfo.genre,
      })
      .then((res) => {
        commitSuccess.current = !commitSuccess.current;
        setCommitButtonEnable(true);
        setAlarm(res.data);
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 2000);
      });
  };
  const handleAddCollectionElement = () => {
    setOpenNewCollectionElementModal(false);
    axios
      .post("https://ollim.herokuapp.com/addCollectionElement", {
        genre,
        writingDocID,
        collectionElementNum: collectionNumArray.length + 1,
        title: newCollectionElementTitle,
      })
      .then((res) => {
        commitSuccess.current = !commitSuccess.current;
        setAlarm(res.data);
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 2000);
      });
    setNewCollectionElementTitle("");
  };
  // useEffect to get writing information
  useEffect(() => {
    getWritingInfo(writingDocID, genre).then((res) => {
      setWritingInfo(res);
      nowCollectionNum === 0 && setNowCollectionNum(1);
      setCollectionNumArray(Object.keys(res.collection));
      setTempSaveState(
        nowCollectionNum === 0
          ? res.collection["1"].tempSave
          : res.collection[nowCollectionNum.toString()].tempSave
      );
    });
  }, [commitSuccess.current]);

  useEffect(() => {
    // Check is writingInfo empty
    if (Object.keys(writingInfo).length !== 0) {
      const nowCollection = writingInfo.collection[nowCollectionNum.toString()];
      // Has chapter and chapter number already set
      if (nowCollectionNum && loadTemp.current) {
        if (Object.keys(nowCollection.tempSave).length !== 0) {
          setTempSaveState(nowCollection.tempSave);
          // Get temporary save of collection
          let date = new Date(nowCollection.tempSave.date);

          // Ask if user is going to load temporary save
          let getTmpSave = window.confirm(
            `${
              "[" +
              date.getFullYear() +
              "년 " +
              (date.getMonth() + 1) +
              "월 " +
              date.getDate() +
              "일 " +
              date.getHours() +
              ":" +
              date.getMinutes() +
              ":" +
              date.getSeconds() +
              "]"
            } 에 임시저장한 글이 있습니다. 불러오시겠습니까?`
          );
          getTmpSave && setValue(nowCollection.tempSave.contents);
          getTmpSave && setLoading(true);
          loadTemp.current = false;
        }
      } else {
        loadTemp.current = true;
      }
    }
  }, [writingInfo, nowCollectionNum]);

  // If value changed (ex. selected commit changed)
  useEffect(() => {
    setLoading(false);
  }, [value]);

  // window.addEventListener("beforeunload", function (e) {
  //   var confirmationMessage = "o/";

  //   (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  //   return confirmationMessage; //Webkit, Safari, Chrome
  // });

  const convertPXtoPercent = (px) => {
    const numberPX = parseInt(px.split("px")[0]) - 20;
    const pixel = 0.2645833333 * numberPX;

    return (pixel / 297) * 100;
  };

  const memoVariants = {
    initial: {
      x: "100%",
    },
    animate: {
      x: "0%",
    },
    exit: {
      x: "100%",
    },
  };
  const tempSaveDivVariants = {
    initial: {
      y: "100%",
      opacity: "0%",
    },
    animate: {
      y: "0%",
      opacity: "100%",
    },
    exit: {
      opacity: "0%",
    },
  };

  return (
    <>
      {/* Submit Commitment modal */}
      {openModal && (
        <motion.div
          animate={{
            backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
          }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 10000 }}
          className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
          onClick={(e) => {
            e.stopPropagation();
            setOpenModal(false);
          }}
        >
          {writingInfo &&
            writingInfo.collection[nowCollectionNum.toString()].commits && (
              <div
                style={{ backgroundColor: "#f7f7f7" }}
                className="flex flex-col items-center w-1/4 h-1/2 py-5 rounded-lg"
              >
                <span className="text-xl font-bold text-gray-500 mb-5">
                  제출 기록
                </span>
                <div className="flex flex-col items-center w-full h-full px-10 gap-3 overflow-y-scroll">
                  {writingInfo.collection[
                    nowCollectionNum.toString()
                  ].commits.map((data) => {
                    const tmpData = Object.keys(data);
                    const key = "memo" === tmpData[0] ? tmpData[1] : tmpData[0];
                    const date = new Date(parseInt(key)).toLocaleString();
                    const DateNight = date.includes("오전") ? "오전" : "오후";
                    return (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedKey !== key) {
                            setLoading(true);
                            setSelectedKey(key);
                            setValue(data[key]);
                            setOpenModal(false);
                          }
                        }}
                        key={key}
                        className={`w-full flex items-center justify-center cursor-pointer shadow-lg px-2 py-2 rounded-2xl ${
                          selectedKey === key && "bg-genreSelectedBG"
                        } hover:bg-wirtingButtonHover`}
                      >
                        <div className="flex items-center w-5/6 justify-between">
                          <div className="flex flex-col items-center text-sm">
                            <span>{date.split(DateNight)[0]}</span>
                            <span>
                              {`${DateNight} `}
                              {date.split(DateNight)[1]}
                            </span>
                          </div>
                          <textarea
                            value={data.memo}
                            readOnly
                            className="w-1/2 text-sm resize-none cursor-pointer focus:outline-none bg-transparent"
                          >
                            {data.memo}
                          </textarea>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </motion.div>
      )}
      {/* Change current editing chapter or poem element of collection modal */}
      {changeCollectionElementModal && writingInfo.isCollection && (
        <motion.div
          animate={{
            backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
          }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 10000 }}
          className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
          onClick={() => {
            setChangeCollectionElementModal(false);
          }}
        >
          {writingInfo && writingInfo.collection && (
            <div
              style={{ backgroundColor: "#f7f7f7" }}
              className="flex flex-col items-center w-1/4 h-1/2 py-5 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span className="text-xl font-bold text-gray-500 mb-5">
                {genre !== "POEM" ? "장 추가" : "시 추가"}
              </span>
              <div className="flex flex-col items-center w-full h-full px-10 gap-3 overflow-y-scroll">
                {Object.keys(writingInfo.collection).map((data) => {
                  const collection = writingInfo.collection[data];

                  return (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (nowCollectionNum !== parseInt(data)) {
                          setNowCollectionNum(parseInt(data));
                          setChangeCollectionElementModal(false);
                          loadTemp.current = true;
                        }
                      }}
                      key={data}
                      className={`w-full flex items-center justify-center cursor-pointer shadow-lg px-2 py-2 rounded-2xl ${
                        nowCollectionNum === parseInt(data) &&
                        "bg-genreSelectedBG"
                      } hover:bg-wirtingButtonHover`}
                    >
                      <div className="flex items-center w-5/6 justify-between">
                        <span>
                          {genre !== "POEM"
                            ? `제 ${data} 장`
                            : `${data}번째 시`}
                        </span>
                        <span>{collection.title}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}
      {/* Compare modal */}
      {compareModalOpen && (
        <motion.div
          animate={{
            backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
          }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 10000 }}
          className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
          onClick={(e) => {
            e.stopPropagation();
            setCompareModalOpen(false);
          }}
        >
          {writingInfo &&
            writingInfo.collection[nowCollectionNum.toString()].commits && (
              <div
                style={{ backgroundColor: "#f7f7f7" }}
                className="flex flex-col items-center w-1/4 h-1/2 py-5 rounded-lg"
              >
                <span className="text-xl font-bold text-gray-500 mb-5">
                  비교 창 열기
                </span>
                <div className="flex flex-col items-center w-full h-full px-10 gap-3 overflow-y-scroll">
                  {writingInfo.collection[
                    nowCollectionNum.toString()
                  ].commits.map((data) => {
                    const tmpData = Object.keys(data);
                    const key = "memo" === tmpData[0] ? tmpData[1] : tmpData[0];
                    const date = new Date(parseInt(key)).toLocaleString();
                    const DateNight = date.includes("오전") ? "오전" : "오후";

                    return (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedCompareKey !== key) {
                            setSelectedCompareKey(key);
                            setSlateCompareValue(data[key]);
                            setSlateCompareOpen(true);
                            setCompareModalOpen(false);
                          }
                        }}
                        key={key}
                        className={`w-full flex items-center justify-center cursor-pointer shadow-lg px-2 py-2 rounded-2xl ${
                          selectedCompareKey === key && "bg-genreSelectedBG"
                        } hover:bg-wirtingButtonHover`}
                      >
                        <div className="flex items-center w-5/6 justify-between">
                          <div className="flex flex-col items-center text-sm">
                            <span>{date.split(DateNight)[0]}</span>
                            <span>
                              {`${DateNight} `}
                              {date.split(DateNight)[1]}
                            </span>
                          </div>
                          <textarea
                            value={data.memo}
                            readOnly
                            className="w-1/2 text-sm resize-none cursor-pointer focus:outline-none bg-transparent"
                          >
                            {data.memo}
                          </textarea>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </motion.div>
      )}
      {/* Add new chpater or collection poem element of collection modal*/}
      {openNewCollectionElementModal && writingInfo.isCollection && (
        <motion.div
          animate={{
            backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
          }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 10000 }}
          className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
          onClick={() => {
            setOpenNewCollectionElementModal(false);
          }}
        >
          <div
            style={{ backgroundColor: "#f7f7f7" }}
            className="flex flex-col items-center w-1/4 h-fit py-5 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="text-xl font-bold text-gray-500 mb-5">
              {genre !== "POEM" ? "장 추가" : "시 추가 "}
            </span>
            <div className="flex flex-col items-center w-full h-full px-10 gap-3 overflow-y-scroll">
              <span>
                {genre !== "POEM"
                  ? `${writingInfo.title}의 제 ${
                      collectionNumArray.length + 1
                    } 장`
                  : `${writingInfo.title}의 ${
                      collectionNumArray.length + 1
                    }번째 시`}
              </span>
              <div className="flex w-full items-center">
                <span className="text-md mr-3">제목</span>
                <input
                  onChange={(e) => {
                    setNewCollectionElementTitle(e.target.value);
                  }}
                  value={newCollectionElementTitle}
                  type="text"
                  className="shadow-md w-5/6 border-gray-200 border px-3 py-1 rounded-xl bg-transparent focus:outline-gray-500"
                />
                <button onClick={handleAddCollectionElement}>확인</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Slate Editor */}
      {!loading ? (
        <motion.div layout>
          <Slate
            editor={editor}
            value={value}
            onChange={(value) => {
              setValue(value);
            }}
          >
            {/* Toolbar Div */}
            <div className="flex flex-col items-center">
              <Toolbar isFullScreen={isFullScreen}>
                <MarkButton format="bold" icon="format_bold" />
                <MarkButton format="italic" icon="format_italic" />
                <MarkButton format="underline" icon="format_underlined" />
                <FontSize />
                <FontStyle />
                {!isFullScreen && (
                  <div
                    style={{
                      width: "1px",
                      height: "2rem",
                    }}
                    className="bg-slate-300"
                  />
                )}
                {/* Diagram */}
                {genre !== "POEM" && (
                  <SvgButton
                    openDiagram={openDiagram}
                    setOpenDiagram={setOpenDiagram}
                  />
                )}
                {/* Open Dictionary */}
                <DictButton
                  selectedProp={selected}
                  setIsFullScreen={setIsFullScreen}
                />

                {/* Memo */}
                <Tooltip placement="top" title="메모" arrow>
                  <span
                    onClick={() => {
                      if (
                        openMemo &&
                        localStorage.getItem(`${writingDocID}_memo`) !== memo
                      ) {
                        localStorage.setItem(`${writingDocID}_memo`, memo);
                      }
                      setOpenMemo((origin) => {
                        localStorage.setItem(
                          `${writingDocID}_doseMemoModalOpen`,
                          !origin
                        );
                        return !origin;
                      });
                    }}
                    style={{ fontSize: "20px" }}
                    className="material-icons cursor-pointer text-gray-300 hover:text-slate-500 align-middle"
                  >
                    storage
                  </span>
                </Tooltip>

                {/* Full Screen */}
                <Tooltip placement="top" title="전체 화면" arrow>
                  <span
                    onClick={() => {
                      const doc = document.querySelector(".editor-container");
                      if (doc) {
                        document.fullscreenElement
                          ? document.exitFullscreen()
                          : doc.requestFullscreen({ navigationUI: "show" });
                        setIsFullScreen(!document.fullscreenElement);
                      }
                    }}
                    style={{ fontSize: "18px" }}
                    className="h-fit material-icons cursor-pointer text-gray-300 hover:text-slate-400 align-bottom"
                  >
                    {isFullScreen ? "fullscreen_exit" : "fullscreen"}
                  </span>
                </Tooltip>
                {!isFullScreen && (
                  <div
                    style={{ width: "1px", height: "2rem" }}
                    className="bg-slate-300"
                  />
                )}

                {/* percentage */}
                <Tooltip
                  placement="top"
                  title={`${Math.round(percentage % 100)}% - A4`}
                  arrow
                >
                  <div className="">
                    <div className="flex items-center">
                      <div className="h-3 w-10 rounded-2xl border flex items-center">
                        <div
                          className="h-full rounded-2xl bg-logoBrown bg-opacity-50"
                          style={{ width: `${percentage % 100}%` }}
                        />
                      </div>
                      <span
                        style={{ fontSize: "0.8rem" }}
                        className="ml-2 font-bold text-gray-500"
                      >
                        {parseInt(percentage / 100)} 매
                      </span>
                    </div>
                  </div>
                </Tooltip>

                {/* Chapter */}
                {writingInfo && writingInfo.isCollection && (
                  <div className="ml-3">
                    <div className="flex items-center">
                      <Tooltip
                        placement="top"
                        title={genre !== "POEM" ? "장 교체" : "시 교체"}
                        arrow
                      >
                        <span
                          onClick={() => {
                            setChangeCollectionElementModal(true);
                          }}
                          style={{ fontSize: "0.8rem" }}
                          className="font-bold cursor-pointer text-gray-400 hover:text-slate-500"
                        >
                          {genre !== "POEM"
                            ? `${nowCollectionNum} 장`
                            : writingInfo.collection[nowCollectionNum].title}
                        </span>
                      </Tooltip>
                      <Tooltip
                        placement="top"
                        title={genre !== "POEM" ? "장 추가" : "시 추가"}
                        arrow
                      >
                        <span
                          style={{ fontSize: "1rem" }}
                          className="cursor-pointer material-icons ml-1 font-bold text-gray-300 hover:text-slate-500"
                          onClick={() => {
                            setOpenNewCollectionElementModal(
                              (origin) => !origin
                            );
                          }}
                        >
                          add_circle_outline
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </Toolbar>

              {/* Editable div */}
              <div
                style={{
                  boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
                  backgroundColor: "#FAF6F5",
                }}
                className={`z-50 overflow-y-scroll w-noneFullScreenMenu h-a4Height overflow-x-hidden ${
                  isFullScreen && "my-5 h-a4FullScreenHeight"
                }`}
              >
                <ResizeObserver
                  onResize={() => {
                    const doc = document.querySelector(".editable-container");
                    setPercentage(
                      convertPXtoPercent(getComputedStyle(doc).height)
                    );
                  }}
                >
                  <div className="editable-container">
                    <Editable
                      className={cx(
                        "whitespace-pre-wrap break-all",
                        css`
                          padding-top: 20px;
                          padding-bottom: 20px;
                          width: 220mm;
                          p {
                            cursor: text;
                            width: 210mm;
                            padding-right: 20px;
                            padding-left: 20px;
                          }
                          span {
                            max-width: 210mm;
                          }
                        `
                      )}
                      onMouseUp={(e) => {
                        let seleted = Editor.string(editor, editor.selection);
                        setSelected(seleted);
                      }}
                      onBlur={() => {
                        setSelected("");
                      }}
                      renderElement={renderElement}
                      renderLeaf={renderLeaf}
                      spellCheck="false"
                      autoFocus
                      onKeyDown={(event) => {
                        for (const hotkey in HOTKEYS) {
                          if (isHotkey(hotkey, event)) {
                            event.preventDefault();
                            const mark = HOTKEYS[hotkey];
                            if (mark === "diagram") {
                              setOpenDiagram((origin) => !origin);
                            } else if (mark === "tempSave") {
                              handleRequestTempSave();
                            } else {
                              toggleMark(editor, mark);
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </ResizeObserver>
              </div>
            </div>

            {/* Save Div */}
            {writingInfo && (
              <div
                style={{ bottom: "5%", right: "5%", zIndex: 52 }}
                className="fixed flex items-center font-noto"
              >
                <motion.button
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    setTempSaveModal((origin) => !origin);
                  }}
                  disabled={!temporarySaveButtonEnable}
                  style={{ fontSize: "0.8rem" }}
                  className="cursor-pointer relative w-20 h-8 rounded-2xl mr-5 border-2 border-blue-400 text-blue-400 bg-transparent flex items-center justify-center"
                >
                  <AnimatePresence>
                    {tempSaveModal && (
                      <motion.div
                        variants={tempSaveDivVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ top: "-200%" }}
                        className="absolute w-fit h-10 flex items-center justify-center"
                      >
                        <motion.button
                          whileHover={{ y: "-10%" }}
                          className="shadow-md px-1 py-1 flex items-center justify-center rounded-full border-2 border-blue-400 text-blue-400 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTempSaveModal(false);
                            setTemporarySaveButtonEnable(false);
                            handleRequestTempSave();
                          }}
                        >
                          <span className="material-icons">save</span>
                        </motion.button>
                        {Object.keys(tempSaveState).length !== 0 && (
                          <motion.button
                            whileHover={{ y: "-10%" }}
                            className="px-1 py-1 ml-5 flex items-center justify-center rounded-full border-2 border-blue-400 text-blue-400 bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTempSaveModal(false);
                              setTemporarySaveButtonEnable(false);
                              handleRequestTempSaveRemove();
                            }}
                          >
                            <span class="material-icons">delete</span>
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {temporarySaveButtonEnable ? "임시 저장" : <SpinningSvg />}
                </motion.button>

                <motion.button
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    setOpenCommitModal(true);
                  }}
                  disabled={!commitButtonEnable}
                  style={{ fontSize: "0.8rem" }}
                  className="flex items-center justify-center w-20 h-8 shadow-md rounded-2xl border-2 border-blue-400 text-blue-400 bg-transparent"
                >
                  {commitButtonEnable ? "제출" : <SpinningSvg />}
                </motion.button>
              </div>
            )}

            {/* Commit load Div */}
            <div
              style={{ bottom: "5%", left: "5%", zIndex: 52 }}
              className="fixed font-noto flex items-center"
            >
              <motion.span
                whileHover={{ y: "-10%" }}
                onClick={() => {
                  if (
                    writingInfo.collection[nowCollectionNum.toString()].commits
                      .length !== 0
                  ) {
                    setOpenModal(true);
                  }
                }}
                style={{ fontSize: "2rem" }}
                className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2"
              >
                update
              </motion.span>
              <motion.span
                onClick={() => {
                  if (
                    writingInfo.collection[nowCollectionNum.toString()].commits
                      .length !== 0
                  ) {
                    setCompareModalOpen(true);
                  }
                }}
                whileHover={{ y: "-10%" }}
                style={{ fontSize: "2rem" }}
                className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2 mx-5"
              >
                compare
              </motion.span>
              {selectedCompareKey && (
                <motion.span
                  whileHover={{ y: "-10%" }}
                  style={{ fontSize: "2rem" }}
                  onClick={() => {
                    setSlateCompareOpen(false);
                    setSelectedCompareKey("");
                  }}
                  className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  close
                </motion.span>
              )}
            </div>
          </Slate>
        </motion.div>
      ) : (
        // Loading Div
        <div className="w-full h-full top-0 left-0 fixed flex items-center justify-center">
          <img
            style={{ width: "12%" }}
            src="/logo/Ollim-logos_black.png"
            alt="writing loading..."
          />
        </div>
      )}

      {/* Diagram div */}
      <AnimatePresence>
        {openDiagram && (
          <motion.div
            animate={{ y: ["100%", "0%"] }}
            exit={{ y: ["0%", "100%"] }}
            transition={{ y: { duration: 0.3 } }}
            style={{ boxShadow: "0px -4px 10px rgba(0,0,0,0.05)" }}
            className="z-50 bottom-0 fixed w-full h-1/3 bg-white"
          >
            <DiagramWrite
              isInitialMount={isInitialMount}
              writingDocID={writingDocID}
              genre={writingInfo.genre}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memo div */}
      <AnimatePresence>
        {openMemo && (
          <motion.div
            variants={memoVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ zIndex: 51 }}
            className="fixed w-72 h-96 right-0 top-1/3 drop-shadow-lg"
          >
            {/* <span
              style={{ bottom: "5%", left: "6.6%" }}
              className="material-icons absolute cursor-pointer text-gray-300 hover:text-slate-400 align-middle bg-gray-100 px-2 py-2 rounded-full inline-block"
            >
              save
            </span> */}
            <textarea
              spellCheck={false}
              value={memo}
              onChange={(e) => {
                setMemo(e.target.value);
                localStorage.setItem(`${writingDocID}_memo`, e.target.value);
              }}
              className="rounded-l-xl px-4 py-4 resize-none overflow-y-scroll w-full h-full font-noto focus:outline-none"
            >
              {memo}
            </textarea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Commit modal */}
      <AnimatePresence>
        {openCommitModal && (
          <motion.div
            animate={{
              backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
            }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 10000 }}
            className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
            onClick={() => {
              setOpenCommitModal(false);
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex flex-col w-1/3 h-1/2 bg-white justify-between px-7 py-7 font-noto"
            >
              <div className="flex items-center mb-5">
                <span className="text-2xl font-bold">제출 메모</span>
                <span className="ml-5 text-xs italic text-gray-500">
                  오늘 작성한 작업물에 대한 간단한 설명을 기록하세요
                </span>
              </div>
              <textarea
                spellCheck={false}
                value={commitDescription}
                style={{ boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.5)" }}
                onChange={(e) => {
                  setCommitDescription(e.target.value);
                }}
                className="text-sm text-gray-500 resize-none overflow-y-scroll w-full h-3/4 rounded-lg focus:outline-none px-3 py-2"
              >
                {commitDescription}
              </textarea>
              <div className="w-full flex items-center justify-center mt-5">
                <span
                  style={{ fontSize: "2rem" }}
                  onClick={() => {
                    handleRequestCommit();
                    setCommitDescription("");
                    setCommitButtonEnable(false);
                    setOpenCommitModal(false);
                  }}
                  className="mr-3 material-icons text-green-400 rounded-full cursor-pointer hover:bg-green-100"
                >
                  check_circle
                </span>
                <span
                  style={{ fontSize: "2rem" }}
                  onClick={() => {
                    setOpenCommitModal(false);
                  }}
                  className="material-icons text-red-400 rounded-full cursor-pointer hover:bg-red-100"
                >
                  cancel
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SlateEditor;
