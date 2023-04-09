import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useContext, useEffect, useState } from "react";
import UserContext from "../../context/user";
import { useAppDispatch } from "../../hooks/useRedux";
import { alarmAction } from "../../redux";
import { deleteComment, getUserByUID, updateCommentLikes } from "../../services/firebase";
import { alarmType, commentType, getFirestoreUser } from "../../type";
import SpinningSvg from "../mypage/SpinningSvg";

interface props {
  writingDocID: string;
  index: number;
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
  isAlarmComment?: boolean;
  commentData: commentType
}

const CommentRow: React.FC<props> = ({
  commentData,
  index,
  setComments,
  writingDocID,
  isAlarmComment,
}) => {
  const [commentOwnerInfo, setCommentOwnerInfo] = useState(
    {} as getFirestoreUser
  );
  const [likesState, setLikesState] = useState<string[]>([]);
  const [doesUserLike, setDoesUserLike] = useState(false);
  const { user } = useContext(UserContext);
  const [commentSettingOpen, setCommentSettingOpen] = useState(false);
  const [deleteBtnDisable, setDeleteBtnDisable] = useState(false);
  const [reportBtnDisable, setReportBtnDisable] = useState(false);
  const [reasonForReport, setResonForReport] = useState("");

  const dispatch = useAppDispatch();
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };
  useEffect(() => {
    getUserByUID(commentData.commentOwnerUID).then((res: any) => {
      setCommentOwnerInfo(res);
    });
  }, [commentData.commentOwnerUID]);

  useEffect(() => {
    setLikesState(commentData.likes);
    setDoesUserLike(commentData.likes.includes(user.uid));
  }, []);

  const handleCommentLike = () => {
    setLikesState((origin) => {
      let likesTmp = origin.slice();
      let result = updateCommentLikes(doesUserLike, commentData.docID, user.uid)
      if (result) {
        // Like
        if (doesUserLike) {
          const indexLocal = likesTmp.indexOf(user.uid);
          setDoesUserLike((origin) => !origin);
          likesTmp.splice(indexLocal, 1);
          setComments((origin) => {
            let tmp = origin.slice();
            let tmpLikes = tmp[index].likes;

            tmpLikes.push(user.uid);
            tmp[index] = { ...origin[index], likes: tmpLikes };

            return tmp;
          });
        } else {
          // Cancle Like
          likesTmp.push(user.uid);
          setDoesUserLike((origin) => !origin);
          setComments((origin) => {
            let tmp = origin.slice();
            let tmpLikes = tmp[index].likes;

            tmpLikes.splice(tmpLikes.indexOf(user.uid), 1);
            tmp[index] = { ...origin[index], likes: tmpLikes };

            return tmp;
          });
        }
      }
      return likesTmp;
    });
  };
  const handleCommentDelete = async () => {
    setDeleteBtnDisable(true);
    let x = await deleteComment(commentData.docID, writingDocID, commentData.dateCreated)
    if (x) {
      setComments((origin) => {
        let tmp = origin.slice();
        tmp.splice(index, 1);
        setDeleteBtnDisable(false);
        return tmp;
      });
    } else {
      setDeleteBtnDisable(false);
    }

  };
  const handleCommentReport = () => {
    setReportBtnDisable(true);
    axios
      .post("https://ollim.onrender.com/reportComment", {
        reportUID: user.uid,
        reportedUID: commentData.commentOwnerUID,
        commentDocID: commentData.docID,
        reasonForReport,
      })
      .then((res) => {
        setReportBtnDisable(false);
        setAlarm(res.data);
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 3000);
      });
  };
  return (
    <>
      {
        <AnimatePresence>
          <motion.div
            layout
            animate={{
              opacity: [0, 1],
              backgroundColor: isAlarmComment ? ["#fff", "#aaa", "#fff"] : [],
            }}
            className="flex flex-col items-start justify-center w-full border-t border-opacity-10 shadow-md px-3 py-3"
          >
            <div className="flex items-center justify-between mb-3 w-full">
              <div className="flex items-center">
                <img
                  className="w-7 rounded-full mr-3"
                  src={commentOwnerInfo.profileImg}
                  alt="comment owner"
                />
                <span className="text-sm text-gray-500">
                  {commentOwnerInfo.username}
                </span>
                <span
                  onClick={() => {
                    setCommentSettingOpen((origin) => !origin);
                  }}
                  className="material-icons text-gray-500 cursor-pointer hover:text-black"
                >
                  more_vert
                </span>
                <AnimatePresence>
                  {commentSettingOpen && (
                    <motion.div
                      initial={{ x: "-30%", opacity: "0%" }}
                      animate={{ x: "0%", opacity: "100%" }}
                      exit={{ opacity: "0%" }}
                      className="flex items-center"
                    >
                      {user.uid === commentData.commentOwnerUID && (
                        <button
                          onClick={handleCommentDelete}
                          disabled={deleteBtnDisable}
                        >
                          {!deleteBtnDisable ? (
                            <span className="material-icons cursor-pointer text-gray-500 hover:text-black text-xl">
                              delete
                            </span>
                          ) : (
                            <SpinningSvg />
                          )}
                        </button>
                      )}
                      {/*                             
                        <button disabled={reportBtnDisable} className="mr-1" onClick={handleCommentReport} disabled={deleteBtnDisable}>
                          {!reportBtnDisable ?
                        <span className="material-icons cursor-pointer text-gray-500 hover:text-black text-xl">
                        report_problem
                        </span> : <SpinningSvg />} 
                        </button> */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center">
                <span
                  onClick={handleCommentLike}
                  className={`material-icons mr-2 cursor-pointer ${doesUserLike ? "text-red-400" : "text-gray-400"
                    }`}
                >
                  favorite
                </span>
                <span className={`text-gray-400 text-sm`}>
                  {likesState.length}
                </span>
              </div>
            </div>
            <textarea
              value={commentData.content}
              readOnly
              style={{ maxHeight: "100px" }}
              className="w-full focus:outline-none"
            />
          </motion.div>
        </AnimatePresence>
      }
    </>
  );
};

export default memo(CommentRow);
