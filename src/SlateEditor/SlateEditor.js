import { useCallback, useEffect, useMemo, useState } from "react";
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
import CustomNodeFlow from "../diagram/RelationShipDiagram";
import {
  Leaf,
  toggleMark,
  FontSize,
  FontStyle,
  SvgButton,
  DictButton,
  initialValue,
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

const SlateEditor = ({ openDiagram, setOpenDiagram, writingDocID, genre }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [selected, setSelected] = useState("");
  const [writingInfo, setWritingInfo] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
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
  const setAlarm = (alarm) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };
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
        // get temporary save first
        setValue(writingInfo.tempSave.contents);
      } else if (Object.keys(writingInfo.commits).length !== 0) {
        // get lastest commit
        const lastestCommit =
          writingInfo.commits[writingInfo.commits.length - 1];
        let key = Object.keys(lastestCommit);
        key = key[0] === "memo" ? key[1] : key[0];
        setValue(lastestCommit[key]);
      }
      setLoading(true);
    }
  }, [writingInfo]);

  return (
    <>
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
          </Slate>
        </div>
      ) : (
        <div className="w-full h-full top-0 left-0 fixed flex items-center justify-center bg-[#e6d6d1]">
          <img
            src="/logo/Ollim-logos_black.png"
            alt="writing loading..."
            className="w-[12%]"
          />
        </div>
      )}
      <AnimatePresence>
            {openDiagram && 
            <motion.div animate={{ y: ["100%", "0%"] }} exit={{ y: ["0%", "100%"] }} transition={{ y: { duration: 0.3 } }} className="z-50 bottom-0 fixed w-full h-1/3 bg-white">
                <CustomNodeFlow writingDocID={writingDocID} genre={writingInfo.genre} isWritingPage={true} />
            </motion.div>}
      </AnimatePresence>
    </>
  );
};

export default SlateEditor;
