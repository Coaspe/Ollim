import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Editable, withReact, Slate, ReactEditor } from "slate-react";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { cx, css } from "@emotion/css";
import { getCommentsInfinite, getWritingInfo } from "../services/firebase";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf } from "./utils";
import ParagraphWithoutNum from "./paragraphWithoutNum";
import CommentRow from "../components/CommentRow";
import axios from "axios";
import SpinningSvg from "../components/SpinningSvg";
import { Tooltip } from "@mui/material";
import { isFullScreenAction } from "../redux";
import { useDispatch, useSelector } from "react-redux";

const SlateEditorRDOnly = ({
  writingDocID,
  widthSize,
  contextUserInfo,
  alarmCommentDocID,
  test,
}) => {
  const [commentLoading, setCommentLoading] = useState(false);
  // SlateEditor value state
  const [value, setValue] = useState([]);
  // Selected commit key
  const [selectedKey, setSelectedKey] = useState("");
  // Loading State
  const [loading, setLoading] = useState(false);
  // Render SlateEditor Leaf
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  // Slate Editor
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  // WritingInfo State
  const [writingInfo, setWritingInfo] = useState({});

  // Load commit modal open state
  const [openLoadCommitModal, setOpenLoadCommitModal] = useState(false);
  // Comment modal open state
  const [openCommentsModal, setOpenCommentsModal] = useState(false);

  // Writing's comments state
  const [comments, setComments] = useState([]);
  // Writing's comments' DocID
  const [commentsDocID, setCommentsDocID] = useState([]);
  const [commentButtonDisabled, setCommentButtonDisabled] = useState(false);

  // Comment Text state
  const [commentText, setCommentText] = useState("");

  // Now selected collection num state
  const [nowCollectionNum, setNowCollectionNum] = useState(0);
  // Collection change modal open state
  const [changeCollectionElementModal, setChangeCollectionElementModal] =
    useState(false);

  // Render SlateEditor element function
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
  const dispatch = useDispatch();

  // FullScreen redux state
  const isFullScreen = useSelector(
    (state) => state.setIsFullScreen.isFullScreen
  );
  const setIsFullScreen = useCallback(
    (isFullScreen) => {
      dispatch(isFullScreenAction.setIsFullScreen({ isFullScreen }));
    },
    [dispatch]
  );
  const [bottomMenuOpen, setBottomMenuOpen] = useState(true);

  // useEffect to get writing's information
  useEffect(() => {
    getWritingInfo(writingDocID).then((res) => {
      setWritingInfo(res);
      nowCollectionNum === 0 && setNowCollectionNum(1);
      setCommentsDocID(
        res.comments
          ? Object.values(
              Object.keys(res.comments)
                .sort()
                .reduce((newObj, key) => {
                  newObj[key] = res.comments[key];
                  return newObj;
                }, {})
            )
          : []
      );
    });
    test.current = false;
  }, [writingDocID]);

  // Get writing's collection's lastest value
  useEffect(() => {
    if (Object.keys(writingInfo).length !== 0 && nowCollectionNum) {
      setLoading(false);
      const elementCommits =
        writingInfo.collection[nowCollectionNum.toString()].commits;
      if (elementCommits.length > 0) {
        // Get lastest commit
        const keys = Object.keys(elementCommits);
        const lastestCommit = elementCommits[keys[keys.length - 1]];
        const lastestCommitKey = Object.keys(lastestCommit);
        const lastDate =
          "memo" !== lastestCommitKey[0]
            ? lastestCommitKey[0]
            : lastestCommitKey[1];
        setValue(lastestCommit[lastDate]);
        setSelectedKey(lastDate);
      } else {
        setValue([
          {
            children: [
              { fontSize: 16, fontSytle: "font-noto", text: "", type: "text" },
            ],
            type: "paragraph",
          },
        ]);
        setSelectedKey("");
      }
    }
  }, [writingInfo, nowCollectionNum]);

  // When value changed, Set load state true
  useEffect(() => {
    value.length > 0 && setLoading(true);
  }, [value]);

  // Loaded Comments Count key
  const commetsKey = useRef(0);
  const commentLoadFirst = useRef(true);

  const handleMoreComments = useCallback(() => {
    if (commentLoadFirst.current) {
      commentLoadFirst.current = false;
    }
    setCommentLoading(true);
    if (commentsDocID.length > 0 && commetsKey.current < commentsDocID.length) {
      getCommentsInfinite(commentsDocID, commetsKey.current).then((res) => {
        let tmp = res.docs
          .map((doc) => ({
            ...doc.data(),
            docID: doc.id,
          }))
          .sort((a, b) => b.dateCreated - a.dateCreated);
        setComments((origin) => {
          return [...origin, ...tmp];
        });
        commetsKey.current += tmp.length;
      });
    }
  }, [commentsDocID]);
  useEffect(() => {
    if (openCommentsModal && commentLoadFirst.current) {
      handleMoreComments();
    }
  }, [openCommentsModal]);

  // Comment modal framer-motion variant
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
  // Add comment function
  const handleAddComment = () => {
    setCommentText("");
    setCommentButtonDisabled(true);
    const dateCreated = new Date().getTime();
    const commentInfo = {
      replies: {},
      content: commentText,
      commentOwnerUID: contextUserInfo.uid,
      likes: [],
      dateCreated,
    };
    // https://ollim.herokuapp.com/addComment
    axios
      .post("https://ollim.herokuapp.com/addComment", {
        writingDocID,
        writingTitle: writingInfo.title,
        writingOwnerUID: writingInfo.userUID,
        commentInfo: JSON.stringify(commentInfo),
        commentUserInfo: JSON.stringify(contextUserInfo),
      })
      .then((res) => {
        if (res.data[1] === "success") {
          commentInfo["docID"] = res.data[3];
          setComments((origin) => [commentInfo, ...origin]);
        }
        setCommentButtonDisabled(false);
      });
  };
  useEffect(() => {
    comments.length > 0 && setCommentLoading(false);
  }, [comments]);
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
            className="fixed right-0 w-1/3 h-2/3 bg-white flex flex-col items-center border border-opacity-20 border-black GalaxyS20Ultra:w-4/5 GalaxyS20Ultra:h-1/2"
          >
            <motion.div
              layout
              className="w-full h-full gap-5 overflow-y-scroll py-2 px-4 flex flex-col items-center"
            >
              {commentsDocID.length !== 0 ? (
                <>
                  {comments.map((comment, index) => (
                    <CommentRow
                      genre={writingInfo.genre}
                      writingDocID={writingDocID}
                      key={comment.dateCreated}
                      replies={comment.replies}
                      content={comment.content}
                      commentOwnerUID={comment.commentOwnerUID}
                      likes={comment.likes}
                      dateCreated={comment.dateCreated}
                      docID={comment.docID}
                      index={index}
                      setComments={setComments}
                      isAlarmComment={comment.docID === alarmCommentDocID}
                    />
                  ))}
                  {/* Load more followings button */}
                  {commetsKey.current < commentsDocID.length && (
                    <div
                      onClick={handleMoreComments}
                      className={`${
                        commentLoading && "pointer-events-none"
                      } font-semibold text-sm shadow-inner cursor-pointer w-1/2 bg-white h-10 flex items-center justify-center rounded-xl text-gray-500`}
                    >
                      {!commentLoading && "Load more..."}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-2xl font-bold text-gray-400 font-Nanum_Gothic mt-5">
                  댓글이 없습니다. ㅠㅠ
                </p>
              )}
            </motion.div>
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
        {openLoadCommitModal && (
          <motion.div
            animate={{
              backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
            }}
            transition={{ duration: 0.1 }}
            style={{ zIndex: 10000 }}
            className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
            onClick={(e) => {
              e.stopPropagation();
              setOpenLoadCommitModal(false);
            }}
          >
            {writingInfo &&
              writingInfo.collection[nowCollectionNum.toString()].commits && (
                <div
                  style={{ backgroundColor: "#f7f7f7" }}
                  className="flex flex-col items-center w-1/4 h-1/2 py-5 rounded-lg GalaxyS20Ultra:w-4/5 GalaxyS20Ultra:h-1/2"
                >
                  <span className="text-xl font-bold text-gray-500 mb-5">
                    제출 기록
                  </span>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex flex-col items-center w-full h-full px-10 gap-3 overflow-y-scroll"
                  >
                    {writingInfo.collection[
                      nowCollectionNum.toString()
                    ].commits.map((data) => {
                      const tmpData = Object.keys(data);
                      const key =
                        "memo" === tmpData[0] ? tmpData[1] : tmpData[0];
                      const date = new Date(parseInt(key)).toLocaleString();
                      const DateNight = date.includes("오전") ? "오전" : "오후";
                      return (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedKey !== key) {
                              setLoading(false);
                              setSelectedKey(key);
                              setValue(data[key]);
                              setOpenLoadCommitModal(false);
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
      </AnimatePresence>
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
                {writingInfo.genre !== "POEM" ? "장" : "시"}
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
                          {writingInfo.genre !== "POEM"
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
      {loading ? (
        <Slate
          readOnly
          editor={editor}
          value={value}
          onChange={(value) => {
            setValue(value);
          }}
        >
          {writingInfo.isCollection && !isFullScreen && (
            <div
              onClick={() => {
                setChangeCollectionElementModal(true);
              }}
              className={`flex flex-col items-center mb-5 cursor-pointer px-2 py-2 rounded-2xl hover:bg-gray-200`}
            >
              <span className="mb-2 text-lg">
                {writingInfo.genre !== "POEM"
                  ? `제${nowCollectionNum} 장`
                  : `${nowCollectionNum}번째 시`}
              </span>
              <span className="text-2xl text-extrabold italic">
                {writingInfo.collection[nowCollectionNum.toString()].title}
              </span>
            </div>
          )}
          <div
            style={{
              boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
              backgroundColor: "#FAF6F5",
            }}
            className={`z-50 editor-inner-browse overflow-y-scroll w-noneFullScreenMenu GalaxyS20Ultra:w-4/5 GalaxyS20Ultra:overflow-x-scroll h-a4Height overflow-x-hidden ${
              isFullScreen && "my-5"
            }`}
          >
            <Editable
              className={cx(
                "whitespace-pre-wrap break-all",
                css`
                  padding-top: 20px;
                  padding-bottom: 20px;
                  p {
                    width: ${widthSize > 500 ? "220mm" : "100%"};
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
          </div>
          <AnimatePresence initial={false}>
            {bottomMenuOpen ? (
              <motion.div
                key="Menu"
                animate={{ y: ["100%", "0%"], opacity: [0, 1] }}
                exit={{ y: ["0%", "100%"], opacity: [1, 0] }}
                transition={{ duration: 0.1 }}
                style={{ bottom: "5%", right: "5%", zIndex: 52 }}
                className="fixed font-noto flex items-center space-x-5 > * + *"
              >
                <motion.span
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    setBottomMenuOpen(false);
                  }}
                  style={{ fontSize: "2rem" }}
                  className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  expand_more
                </motion.span>
                {writingInfo.isCollection && isFullScreen && (
                  <Tooltip
                    arrow
                    placement="top"
                    title={`${nowCollectionNum}.${
                      writingInfo.collection[nowCollectionNum.toString()].title
                    }`}
                  >
                    <motion.span
                      onClick={() => {
                        setChangeCollectionElementModal(true);
                      }}
                      style={{ fontSize: "2rem" }}
                      whileHover={{ y: "-10%" }}
                      className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2"
                    >
                      timeline
                    </motion.span>
                  </Tooltip>
                )}
                <motion.span
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    const doc = document.querySelector(
                      ".editor-container-browse"
                    );
                    if (doc) {
                      document.fullscreenElement
                        ? document.exitFullscreen()
                        : doc.requestFullscreen({ navigationUI: "show" });
                      setIsFullScreen(!document.fullscreenElement);
                    }
                  }}
                  style={{ fontSize: "2rem" }}
                  className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  {isFullScreen ? "fullscreen_exit" : "fullscreen"}
                </motion.span>
                <motion.span
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    if (
                      writingInfo.collection[nowCollectionNum.toString()]
                        .commits.length !== 0
                    ) {
                      setOpenLoadCommitModal(true);
                    }
                  }}
                  style={{ fontSize: "2rem" }}
                  className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  update
                </motion.span>
                <motion.span
                  whileHover={{ y: "-10%" }}
                  onClick={() => {
                    setOpenCommentsModal((origin) => !origin);
                  }}
                  style={{ fontSize: "2rem" }}
                  className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  chat
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                key="key"
                animate={{ y: ["100%", "0%"], opacity: [0, 1] }}
                exit={{ y: ["0%", "100%"], opacity: [1, 0] }}
                transition={{ duration: 0.1 }}
                style={{ bottom: "0%", right: "50%", zIndex: 52 }}
                className="fixed"
              >
                <span
                  style={{ fontSize: "2rem" }}
                  onClick={() => {
                    setBottomMenuOpen(true);
                  }}
                  className="material-icons shadow-md cursor-pointer text-gray-400 hover:text-slate-500 align-middle bg-white rounded-full inline-block px-2 py-2"
                >
                  expand_less
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {writingInfo && writingInfo.bgm && (
            <div
              style={{ bottom: "5%", left: "1%", zIndex: 52 }}
              className="fixed font-noto flex items-center"
            >
              <audio controls autoPlay loop>
                <source src={writingInfo.bgm} type="audio/mpeg" />
              </audio>
            </div>
          )}
        </Slate>
      ) : (
        <div className="w-full h-full top-0 left-0 fixed flex items-center justify-center">
          <img
            style={{ width: "12%", opacity: "50%" }}
            src="/logo/Ollim-logos_black.png"
            alt="writing loading..."
          />
        </div>
      )}
    </>
  );
};

export default SlateEditorRDOnly;
