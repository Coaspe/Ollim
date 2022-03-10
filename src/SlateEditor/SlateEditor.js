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
}) => {
  const [percentage, setPercentage] = useState(0);

  const dispatch = useDispatch();
  const isInitialMount = useRef(0);

  // Writing Info loading state
  const [loading, setLoading] = useState(false);

  // Commit sccess
  const commitSuccess = useRef(false);
  // To prevent thoughtless commit, temporary save
  const commitButtonEnable = useRef(true);
  const temporarySaveButtonEnable = useRef(true);

  // Render Slate leaf nodes
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Selected words to search for dictionary
  const [selected, setSelected] = useState("");

  // Overall Writing Information
  const [writingInfo, setWritingInfo] = useState({});

  // Is Full Screen?
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  // Save fuctions
  const handleRequestTempSave = () => {
    axios
      .post(`https://ollim.herokuapp.com/temporarySave`, {
        contents: JSON.stringify(value),
        writingDocID,
        genre: writingInfo.genre,
      })
      .then((res) => {
        temporarySaveButtonEnable.current = true;
        setAlarm(res.data);
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 2000);
      });
  };
  const handleRequestCommit = () => {
    axios
      .post("https://ollim.herokuapp.com/commit", {
        contents: JSON.stringify(value),
        writingDocID,
        userUID: writingInfo.userUID,
        memo: commitDescription,
        genre: writingInfo.genre,
        title: writingInfo.title,
      })
      .then((res) => {
        commitSuccess.current = !commitSuccess.current;
        commitButtonEnable.current = true;
        setAlarm(res.data);
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 2000);
      });
  };

  // useEffect to get writing information
  useEffect(() => {
    getWritingInfo(writingDocID, genre).then((res) => {
      setWritingInfo(res);
    });
  }, [commitSuccess.current]);

  useEffect(() => {
    // Check is writingInfo empty
    if (Object.keys(writingInfo).length !== 0) {
      // Check has temporary save
      if (Object.keys(writingInfo.tempSave).length !== 0) {
        // get temporary save
        let date = new Date(writingInfo.tempSave.date);

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
        getTmpSave && setValue(writingInfo.tempSave.contents);
      }
      setLoading(true);
    }
  }, [writingInfo]);

  // If value changed (ex. selected commit changed)
  // If value changed is caused by typing something, there is no change with contentLoading
  useEffect(() => {
    value.length > 0 && setLoading(true);
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

  // useEffect(() => {
  //   if (slideTrackRef && slideTrackRef.current) {
  //     const resizeObserver = new ResizeObserver((entries) =>
  //       console.log("Body height changed:", entries[0].target.clientHeight)
  //     );
  //     resizeObserver.observe(document.querySelector(".editable-container"));
  //   }
  // }, [slideTrackRef]);

  return (
    <>
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
          {writingInfo && writingInfo.commits && (
            <div className="flex flex-col items-center w-1/4 h-1/2 bg-white py-5 rounded-lg">
              <span className="text-xl font-bold text-gray-500 mb-5">
                제출 기록
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex flex-col items-center w-full h-full px-10 gap-3 overflow-y-scroll"
              >
                {writingInfo.commits.reverse().map((data) => {
                  const tmpData = Object.keys(data);
                  const key = "memo" === tmpData[0] ? tmpData[1] : tmpData[0];
                  const date = new Date(parseInt(key)).toLocaleString();
                  return (
                    <div
                      key={key}
                      className={`w-full flex items-center justify-center cursor-pointer shadow-lg px-2 py-2 rounded-2xl ${
                        selectedKey === key && "bg-genreSelectedBG"
                      } hover:bg-wirtingButtonHover`}
                    >
                      <button
                        onClick={() => {
                          if (selectedKey !== key) {
                            setLoading(false);
                            setSelectedKey(key);
                            setValue(data[key]);
                            setOpenModal(false);
                          }
                        }}
                        className="mr-5"
                      >
                        {date}
                      </button>
                      <span>{data.memo}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {loading ? (
        <Slate
          editor={editor}
          value={value}
          onChange={(value) => {
            setValue(value);
          }}
        >
          {/* Tools */}
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
                className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 align-middle"
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
          </Toolbar>

          <div
            style={{
              boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
              backgroundColor: "#FAF6F5",
            }}
            className={`z-50 editor-inner overflow-y-scroll w-noneFullScreenMenu h-a4Height overflow-x-hidden ${
              isFullScreen && "my-5"
            }`}
          >
            <ResizeObserver
              onResize={() => {
                const doc = document.querySelector(".editable-container");
                setPercentage(convertPXtoPercent(getComputedStyle(doc).height));
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

          {/* Save Div */}
          <div
            style={{ bottom: "5%", right: "5%" }}
            className="fixed font-noto"
          >
            <motion.button
              whileHover={{ y: "-10%" }}
              onClick={() => {
                handleRequestTempSave();
              }}
              disabled={!temporarySaveButtonEnable.current}
              style={{ fontSize: "0.8rem" }}
              className="w-20 h-8 rounded-2xl mr-5 border-2 border-blue-400 text-blue-400 bg-transparent"
            >
              임시 저장
            </motion.button>
            <motion.button
              whileHover={{ y: "-10%" }}
              onClick={() => {
                temporarySaveButtonEnable.current = false;
                setOpenCommitModal(true);
                commitButtonEnable.current = false;
              }}
              disabled={!commitButtonEnable.current}
              style={{ fontSize: "0.8rem" }}
              className="w-20 h-8 rounded-2xl border-2 border-blue-400 text-blue-400 bg-transparent"
            >
              제출
            </motion.button>
          </div>

          {/* Commit load Div */}
          <motion.div
            whileHover={{ y: "-10%" }}
            style={{ bottom: "5%", left: "5%" }}
            className="fixed font-noto flex"
          >
            <span
              onClick={() => {
                if (writingInfo.commits.length !== 0) {
                  setOpenModal(true);
                }
              }}
              style={{ fontSize: "2rem" }}
              className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 align-middle bg-white rounded-full inline-block px-2 py-2 ml-5"
            >
              update
            </span>
          </motion.div>
        </Slate>
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
