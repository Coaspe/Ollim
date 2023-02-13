import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { commentsModalVariants, commentType, getFirestoreUser, getFirestoreWriting } from "../type";
import useGetComments from "../hooks/useGetComments";
import CommentRow from "../components/CommentRow";
import SpinningSvg from "../components/SpinningSvg";
import { addComment } from "../services/firebase";

interface props {
  commentModalOpen: boolean;
  commentsDocId: Array<string>
  alarmCommentDocID: string;
  writingInfo: getFirestoreWriting;
  contextUserInfo: getFirestoreUser;
  writingDocID: string
}

const CommentsModal: React.FC<props> = ({
  commentModalOpen,
  commentsDocId,
  alarmCommentDocID,
  writingInfo,
  contextUserInfo,
  writingDocID
}) => {
  const [commentButtonDisabled, setCommentButtonDisabled] = useState(false);

  // Comment Text state
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    commetsKey,
    comments,
    handleMoreComments,
    setComments
  } = useGetComments(commentsDocId, commentModalOpen, setLoading)

  // Add comment
  const handleAddComment = async () => {
    setCommentText("");
    setCommentButtonDisabled(true);
    let commentInfo: commentType = {
      replies: {},
      content: commentText,
      commentOwnerUID: contextUserInfo.uid,
      docID: "",
      likes: [],
      dateCreated: new Date().getTime(),
    };
    const id = await addComment(writingDocID, writingInfo.title, writingInfo.userUID, commentInfo, contextUserInfo,)
    if (id) {
      commentInfo["docID"] = id
      setComments((origin) => [commentInfo, ...origin]);
    }
    setCommentButtonDisabled(false);
  }
  useEffect(() => {
    comments.length > 0 && setLoading(false);
  }, [comments]);

  return (
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
        {comments.length ? (
          <>
            {comments.map((comment, index) => (
              <CommentRow
                writingDocID={writingDocID}
                key={comment.dateCreated}
                commentData={comment}
                index={index}
                setComments={setComments}
                isAlarmComment={comment.docID === alarmCommentDocID}
              />
            ))}
            {/* Load more followings button */}
            {commetsKey.current < commentsDocId.length && (
              <div
                onClick={handleMoreComments}
                className={`${loading && "pointer-events-none"
                  } font-semibold text-sm shadow-inner cursor-pointer w-1/2 bg-white h-10 flex items-center justify-center rounded-xl text-gray-500`}
              >
                {!loading && "Load more..."}
              </div>
            )}
          </>
        ) : (
          <p className="text-2xl font-bold text-gray-400 font-Nanum_Gothic mt-5">
            댓글이 없습니다.
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
  );
};

export default CommentsModal;

