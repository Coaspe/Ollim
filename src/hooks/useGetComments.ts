import { useCallback, useEffect, useRef, useState } from "react";
import { getCommentsInfinite } from "../services/firebase";
import { commentType } from "../type";

const useGetComments = (
  commentsDocID: Array<string>,
  commentModalOpen: boolean,
  setLoading:  React.Dispatch<React.SetStateAction<boolean>>
) => {
  // To Prevent unnecessary re-rendering, use useRef
  // Load 5 comments, every "Load More" request.
  // Loaded Comments Count key: Indicates how many comments loaded
  const commetsKey = useRef(0);
  // Writing's comments info state
  const [comments, setComments] = useState<Array<commentType>>([]);
  const handleMoreComments = useCallback(() => {
    setLoading(true);
    if (commentsDocID.length > 0 && commetsKey.current < commentsDocID.length) {
      getCommentsInfinite(commentsDocID, commetsKey.current).then((res) => {
        let tmp = res.docs
          .map((doc: any) => ({
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

  // When modal closed, reset followers, followings keys and list
  useEffect(() => {
    if (commentModalOpen && commetsKey.current === 0) {
        handleMoreComments();
    }
  }, [commentModalOpen, handleMoreComments]);

  // Loading more followers, followings completed, set loading false
  useEffect(() => {
    comments.length > 0 && setLoading(false);
  }, [comments]);

  return {
    commetsKey,
    comments,
    handleMoreComments,
    setComments
  };
};

export default useGetComments;
