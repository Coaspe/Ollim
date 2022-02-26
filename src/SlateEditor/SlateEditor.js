import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { Editor, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Toolbar } from "./components";
import { cx, css } from "@emotion/css";
import Paragraph from "./paragraph";
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
  const dispatch = useDispatch();

  const isInitialMount = useRef(0);

  // Writing Info loading state
  const [loading, setLoading] = useState(false);

  // Render Slate leaf nodes
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Selected words to search for dictionary
  const [selected, setSelected] = useState("");

  // Overall Writing Information
  const [writingInfo, setWritingInfo] = useState({});

  // Is Full Screen?
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Variables to loading commit
  const [openModal, setOpenModal] = useState(false);
  // Whether commit contents loading completed
  const [contentLoading, setContentLoading] = useState(true);
  // Selected commit key
  const [selectedKey, setSelectedKey] = useState("");

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
      <Paragraph
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
      .post("http://localhost:3001/temporarySave", {
        contents: JSON.stringify(value),
        writingDocID,
        genre: writingInfo.genre,
      })
      .then((res) => {
        setAlarm(res.data);
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 2000);
      });
  };
  const handleRequestCommit = () => {
    axios
      .post("http://localhost:3001/commit", {
        contents: JSON.stringify(value),
        writingDocID,
        userUID: writingInfo.userUID,
        memo: "memoemoem",
        genre: writingInfo.genre,
        title: writingInfo.title,
      })
      .then((res) => {
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
    return () => {
      setOpenDiagram(false);
    };
  }, []);

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
    value.length > 0 && setContentLoading(true);
  }, [value]);

  return (
    <>
      {openModal && (
        <motion.div
          animate={{
            backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
          }}
          transition={{ duration: 0.2 }}
          className="fixed w-full h-full z-[10000] items-center justify-center top-0 left-0 flex"
          onClick={(e) => {
            e.stopPropagation();
            setOpenModal(false);
          }}
        >
          {writingInfo && writingInfo.commits && (
            <div className="flex flex-col items-start justify-center bg-white">
              {writingInfo.commits.map((data) => {
                const tmpData = Object.keys(data);
                const key = "memo" === tmpData[0] ? tmpData[1] : tmpData[0];
                const date = new Date(parseInt(key)).toLocaleString();
                return (
                  <div
                    key={key}
                    className={`w-full cursor-pointer flex items-center justify-start ${
                      selectedKey === key && "bg-slate-500"
                    } hover:bg-slate-400`}
                  >
                    <button
                      onClick={() => {
                        // if (selectedKey !== key) {
                        setContentLoading(false);
                        setSelectedKey(key);
                        setValue(data[key]);
                        // }
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
          )}
        </motion.div>
      )}

      {loading ? (
        <div
          className={cx(
            "border-2 border-blue-300 z-50 editor-inner",
            css`
              width: 210mm;
              height: 297mm;
              overflow-y: scroll;
            `
          )}
        >
          {contentLoading && (
            <Slate
              editor={editor}
              value={value}
              onChange={(value) => {
                setValue(value);
              }}
            >
              <Toolbar>
                <MarkButton format="bold" icon="format_bold" />
                <MarkButton format="italic" icon="format_italic" />
                <MarkButton format="underline" icon="format_underlined" />
                {genre !== "poem" && (
                  <SvgButton
                    openDiagram={openDiagram}
                    setOpenDiagram={setOpenDiagram}
                  />
                )}
                <DictButton selectedProp={selected} />
                <FontSize />
                <FontStyle />
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
                  className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 text-[20px] align-middle"
                >
                  {isFullScreen ? "fullscreen_exit" : "fullscreen"}
                </span>
              </Toolbar>
              <Editable
                className={cx(
                  "w-full",
                  css`
                    padding-top: 20px;
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

              {/* Save Div */}
              <div className="fixed bottom-[3%] right-[2%] font-noto">
                <motion.button
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    handleRequestTempSave();
                  }}
                  className="w-28 h-10 text-sm rounded-2xl mr-5 border-2 border-blue-400 text-blue-400 bg-transparent"
                >
                  임시 저장
                </motion.button>
                <motion.button
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    handleRequestCommit();
                  }}
                  className="w-28 h-10 text-sm rounded-2xl border-2 border-blue-400 text-blue-400 bg-transparent"
                >
                  제출
                </motion.button>
              </div>

              {/* Commit load Div */}
              <motion.div
                whileHover={{ y: "-10%" }}
                className="fixed bottom-[5%] left-[5%] font-noto flex"
              >
                <span
                  onClick={() => {
                    if (writingInfo.commits.length !== 0) {
                      setOpenModal(true);
                    }
                  }}
                  className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 text-[50px] align-middle bg-white rounded-full inline-block px-2 py-2 ml-5"
                >
                  update
                </span>
              </motion.div>
            </Slate>
          )}
        </div>
      ) : (
        // Loading Div
        <div className="w-full h-full top-0 left-0 fixed flex items-center justify-center bg-[#e6d6d1]">
          <img
            src="/logo/Ollim-logos_black.png"
            alt="writing loading..."
            className="w-[12%]"
          />
        </div>
      )}

      {/* Diagram Div */}
      <AnimatePresence>
        {openDiagram && (
          <motion.div
            animate={{ y: ["100%", "0%"] }}
            exit={{ y: ["0%", "100%"] }}
            transition={{ y: { duration: 0.3 } }}
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
    </>
  );
};

export default SlateEditor;
