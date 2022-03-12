import { AnimatePresence, motion } from "framer-motion"
import { memo, useEffect, useState } from "react"
import { getUserByUID } from "../services/firebase"
import { commentType, getFirestoreUser } from "../type"

interface props {
    commentInfo: commentType
}

const CommentRow: React.FC<props> = ({ commentInfo }) => {

    const [commentOwnerInfo, setCommentOwnerInfo] = useState({} as getFirestoreUser)

    useEffect(() => {
        getUserByUID(commentInfo.commentOwnerUID).then((res: any) => {
            setCommentOwnerInfo(res.docs[0].data())
        })
    }, [commentInfo.commentOwnerUID])

    useEffect(() => {
        console.log("re-rendering");
    },[])
    
    return (
    <AnimatePresence>
        <motion.div layout animate={{opacity:[0,1]} }className="flex flex-col items-start justify-center w-full h-fit border-t border-opacity-10 shadow-md px-3 py-3">
            <div className="flex items-center justify-between mb-3 w-full">
                <div className="flex items-center">
                    <img className="w-7 rounded-full mr-3" src={commentOwnerInfo.profileImg} alt="comment owner" />
                    <span className="text-sm text-gray-500">{commentOwnerInfo.username}</span>
                </div>
                <div className="flex items-center">
                    <span className="material-icons mr-2 text-gray-500 cursor-pointer">
                    favorite
                    </span>
                    <span className="text-gray-500 text-sm">{commentInfo.likes.length}</span>
                </div>
            </div>
            <textarea value={commentInfo.content} rows={1} readOnly className="w-full h-fit resize-none focus:outline-none" />
        </motion.div>
    </AnimatePresence>
    )
}

export default memo(CommentRow)