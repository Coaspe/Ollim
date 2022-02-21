import { useCallback, useEffect, useMemo, useState } from "react";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { cx, css } from "@emotion/css";
import Paragraph from "./paragraph";
import { getWritingInfo } from "../services/firebase";
import { motion } from "framer-motion";
import { Leaf } from "./utils";
import moment from "moment";

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
    if (writingInfo.commits) {
      // get lastest commit
      const keys = Object.keys(writingInfo.commits);
      const lastestCommit = writingInfo.commits[keys[keys.length - 1]];
      setValue(lastestCommit[Object.keys(lastestCommit)[0]]);
      setSelectedKey(Object.keys(lastestCommit)[0]);
      setLoading(true);
      setContentLoading(true);
    }
  }, [writingInfo]);

  useEffect(() => {
    value.length > 0 && setContentLoading(true);
  }, [value]);

  return (
    <>
      {writingInfo && writingInfo.commits && (
        <div className="flex items-center justify-center">
          {writingInfo.commits.map((data) => {
            const key = Object.keys(data)[0];
            const date = new Date(parseInt(key)).toLocaleString();
            return (
              <button
                key={key}
                onClick={() => {
                  if (selectedKey !== key) {
                    setContentLoading(false);
                    setSelectedKey(key);
                    setValue(Object.values(data)[0]);
                  }
                }}
                className="mr-5"
              >
                {date}
              </button>
            );
          })}
        </div>
      )}
      {loading ? (
        <div
          className={cx(
            "border-2 border-blue-300 editor-inner",
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
                className="fixed bottom-[5%] right-[5%] font-noto flex"
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
                  className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 text-[50px] align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  {isFullScreen ? "fullscreen_exit" : "fullscreen"}
                </span>
                <div className="relative flex flex-col">
                  <div className="absolute -top-30">
                    {writingInfo.commits.map((data) => {
                      const key = Object.keys(data)[0];
                      const date = new Date(parseInt(key)).toLocaleString();
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            if (selectedKey !== key) {
                              setContentLoading(false);
                              setSelectedKey(key);
                              setValue(Object.values(data)[0]);
                            }
                          }}
                          className="mr-5 bg-white"
                        >
                          {date}
                        </button>
                      );
                    })}
                  </div>
                  <span class="material-icons cursor-pointer text-gray-300 hover:text-slate-400 text-[50px] align-middle bg-white rounded-full inline-block px-2 py-2 ml-5">
                    update
                  </span>
                </div>
              </motion.div>
            </Slate>
          )}
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

export default SlateEditorRDOnly;
