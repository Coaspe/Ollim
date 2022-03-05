import { useCallback, useEffect, useMemo, useState } from "react";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { cx, css } from "@emotion/css";
import Paragraph from "./paragraph";
import { getWritingInfo } from "../services/firebase";
import { motion } from "framer-motion";
import { Leaf } from "./utils";

const SlateEditorRDOnly = ({
  openDiagram,
  setOpenDiagram,
  writingDocID,
  genre,
}) => {
  const [value, setValue] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [writingInfo, setWritingInfo] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
    if (Object.keys(writingInfo).length !== 0) {
      if (writingInfo.commits.length !== 0) {
        console.log(writingInfo);
        // Get lastest commit
        const keys = Object.keys(writingInfo.commits);
        const lastestCommit = writingInfo.commits[keys[keys.length - 1]];
        const lastestCommitKey = Object.keys(lastestCommit);
        const lastDate =
          "memo" !== lastestCommitKey[0]
            ? lastestCommitKey[0]
            : lastestCommitKey[1];
        setValue(lastestCommit[lastDate]);
        setSelectedKey(lastDate);
      }
      setLoading(true);
      setContentLoading(true);
    }
  }, [writingInfo]);

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
          style={{ zIndex: 10000 }}
          className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
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
                        if (selectedKey !== key) {
                          setContentLoading(false);
                          setSelectedKey(key);
                          setValue(data[key]);
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
          )}
        </motion.div>
      )}
      {loading ? (
        <div
          style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.3)" }}
          className={cx(
            "editor-inner",
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
              <Editable
                className={cx(
                  "w-full",
                  css`
                    padding-top: 20px;
                  `
                )}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck="false"
                readOnly
              />
              <motion.div
                whileHover={{ y: "-10%" }}
                style={{ bottom: "5%", right: "5%" }}
                className="fixed font-noto flex"
              >
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
                  style={{ fontSize: "50px" }}
                  className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  {isFullScreen ? "fullscreen_exit" : "fullscreen"}
                </span>
                <span
                  onClick={() => {
                    if (writingInfo.commits.length !== 0) {
                      setOpenModal(true);
                    }
                  }}
                  style={{ fontSize: "50px" }}
                  className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 align-middle bg-white rounded-full inline-block px-2 py-2 ml-5"
                >
                  update
                </span>
              </motion.div>
            </Slate>
          )}
        </div>
      ) : (
        <div
          style={{ backgroundColor: "#e6e2e1" }}
          className="w-full h-full top-0 left-0 fixed flex items-center justify-center"
        >
          <img
            style={{ width: "12%" }}
            src="/logo/Ollim-logos_black.png"
            alt="writing loading..."
          />
        </div>
      )}
    </>
  );
};

export default SlateEditorRDOnly;
