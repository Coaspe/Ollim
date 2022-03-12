import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { cx, css } from "@emotion/css";
import { getComments, getWritingInfo } from "../services/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf } from "./utils";
import ParagraphWithoutNum from "./paragraphWithoutNum";
import CommentRow from "../components/CommentRow";
import axios from "axios";
import UserContext from "../context/user";
import SpinningSvg from "../components/SpinningSvg";

const SlateEditorRDOnly = ({ writingDocID, genre }) => {
  const [value, setValue] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [writingInfo, setWritingInfo] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCommentsModal, setOpenCommentsModal] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsDocID, setCommentsDocID] = useState([]);
  const [commentButtonDisabled, setCommentButtonDisabled] = useState(false);

  const [commentText, setCommentText] = useState("");
  const { user } = useContext(UserContext);
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

  useEffect(() => {
    getWritingInfo(writingDocID, genre).then((res) => {
      setWritingInfo(res);
      setCommentsDocID(Object.values(res.comments));
    });
  }, []);
  useEffect(() => {
    if (commentsDocID.length !== 0) {
      getComments(commentsDocID).then((res) => {
        setComments(res.docs.map((data) => data.data()));
      });
    }
  }, [commentsDocID]);
  useEffect(() => {
    if (Object.keys(writingInfo).length !== 0) {
      if (writingInfo.commits.length !== 0) {
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

  const commentsModalVariants = {
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
  const handleAddComment = () => {
    setCommentText("");
    setCommentButtonDisabled(true);
    const dateCreated = new Date().getTime();
    const commentInfo = {
      replies: {},
      content: commentText,
      commentOwnerUID: user.uid,
      likes: [],
      dateCreated,
    };
    axios
      .post("https://ollim.herokuapp.com/addComment", {
        writingDocID,
        genre,
        commentInfo: JSON.stringify(commentInfo),
      })
      .then((res) => {
        if (res.data[1] === "success") {
          setComments((origin) => [commentInfo, ...origin]);
        }
        setCommentButtonDisabled(false);
      });
  };
  return (
    <>
      <AnimatePresence>
        {openCommentsModal && (
          <motion.div
            variants={commentsModalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ zIndex: 51, top: "20%" }}
            className="fixed right-0 w-1/3 h-2/3 bg-white flex flex-col items-center border-opacity-50 border"
          >
            <div className="w-full h-full grid gap-5 overflow-y-scroll py-2 px-4">
              {comments &&
                comments.map((comment) => (
                  <CommentRow key={comment.dateCreated} commentInfo={comment} />
                ))}
            </div>
            <div className="w-full shadow-inner h-1/5 border-opacity-50 flex items-center justify-between py-4 px-4">
              <textarea
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                }}
                placeholder="댓글을 입력하세요"
                rows={1}
                className="w-full border mr-4 rounded-xl px-3 py-3 focus:outline-none max-h-full resize-none"
              />
              <motion.button
                whileHover={{ y: "-10%" }}
                onClick={handleAddComment}
                disabled={commentButtonDisabled}
                className="border rounded-full px-2 py-2 flex items-center justify-center"
              >
                {commentButtonDisabled ? (
                  <SpinningSvg />
                ) : (
                  <span className="material-icons">maps_ugc</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
        <div
          style={{
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            backgroundColor: "#FAF6F5",
          }}
          className={cx(
            "z-50 editor-inner overflow-y-scroll w-noneFullScreenMenu h-a4Height overflow-x-hidden",
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
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                spellCheck="false"
                readOnly
              />
              <div
                whileHover={{ y: "-10%" }}
                style={{ bottom: "5%", right: "5%" }}
                className="fixed font-noto flex"
              >
                <motion.span
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    const doc = document.querySelector(".editor-container");
                    if (doc) {
                      document.fullscreenElement
                        ? document.exitFullscreen()
                        : doc.requestFullscreen({ navigationUI: "show" });
                      setIsFullScreen(!document.fullscreenElement);
                    }
                  }}
                  style={{ fontSize: "2rem" }}
                  className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  {isFullScreen ? "fullscreen_exit" : "fullscreen"}
                </motion.span>
                <motion.span
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    if (writingInfo.commits.length !== 0) {
                      setOpenModal(true);
                    }
                  }}
                  style={{ fontSize: "2rem" }}
                  className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 align-middle bg-white rounded-full inline-block px-2 py-2 ml-5"
                >
                  update
                </motion.span>
                <motion.span
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    setOpenCommentsModal((origin) => !origin);
                  }}
                  style={{ fontSize: "2rem" }}
                  className="material-icons cursor-pointer text-gray-300 hover:text-slate-400 align-middle bg-white rounded-full inline-block px-2 py-2 ml-5"
                >
                  chat
                </motion.span>
              </div>
            </Slate>
          )}
        </div>
      ) : (
        <div className="w-full h-full top-0 left-0 fixed flex items-center justify-center">
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
