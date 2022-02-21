import { useCallback, useEffect, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { Editor, createEditor } from "slate";
import { withHistory } from "slate-history";
import { Toolbar } from "./components";
import { cx, css } from "@emotion/css";
import Paragraph from "./paragraph";
import {
  commit,
  getTemporarySave,
  getWritingInfo,
  temporarySave,
  deleteTempSave,
} from "../services/firebase";
import { motion } from "framer-motion";
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

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+d": "diagram",
  "mod+s": "tempSave",
};

// function clearTheSelection() {
//   if (window.getSelection) {
//     if (window.getSelection().empty) {
//       // Chrome
//       window.getSelection().empty();
//     } else if (window.getSelection().removeAllRanges) {
//       // Firefox
//       window.getSelection().removeAllRanges();
//     }
//   } else if (document.selection) {
//     // IE?
//     document.selection.empty();
//   }
// }

const SlateEditor = ({ openDiagram, setOpenDiagram, writingDocID, genre }) => {
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

  useEffect(() => {
    getWritingInfo(writingDocID, genre).then((res) => {
      setWritingInfo(res);
    });
  }, []);

  useEffect(() => {
    if (writingInfo.tempSave) {
      // get temporary save first
      getTemporarySave(writingInfo.tempSave).then((res) => {
        setValue(res.contents);
        setLoading(true);
      });
    } else if (writingInfo.commits) {
      // get lastest commit
      const keys = Object.keys(writingInfo.commits);
      const lastestCommit = writingInfo.commits[keys[keys.length - 1]];
      setValue(lastestCommit[Object.keys(lastestCommit)[0]]);
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
              // onMouseDown={clearTheSelection}
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
                      temporarySave(
                        value,
                        writingInfo.userUID,
                        writingDocID,
                        writingInfo.genre
                      );
                    } else {
                      toggleMark(editor, mark);
                    }
                  }
                }
              }}
            />
            <div className="fixed bottom-[5%] right-[5%] font-noto">
              <motion.button
                whileHover={{ y: "-10%" }}
                onClick={() => {
                  temporarySave(
                    value,
                    writingInfo.userUID,
                    writingDocID,
                    writingInfo.genre
                  );
                }}
                className="w-20 h-10 bg-white text-sm rounded-xl mr-5"
              >
                임시 저장
              </motion.button>
              <motion.button
                whileHover={{ y: "-10%" }}
                onClick={() => {
                  commit(
                    value,
                    writingDocID,
                    writingInfo.genre,
                    writingInfo.title,
                    writingInfo.userUID
                  );
                  // Delete temporary save
                  deleteTempSave(
                    writingInfo.tempSave,
                    writingDocID,
                    writingInfo.genre
                  );
                }}
                className="w-20 h-10 bg-white text-sm rounded-xl"
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
    </>
  );
};

export default SlateEditor;
