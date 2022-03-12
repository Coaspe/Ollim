import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { memo, useContext, useEffect, useState } from "react"
import UserContext from "../context/user"
import { getUserByUID } from "../services/firebase"
import { commentType, getFirestoreUser } from "../type"

interface props extends commentType {
    docID: string
}

const CommentRow: React.FC<props> = ({content, replies, likes, commentOwnerUID, docID, dateCreated }) => {

    const [commentOwnerInfo, setCommentOwnerInfo] = useState({} as getFirestoreUser)
    const [likesState, setLikesState] = useState<string[]>([])
    const [doesUserLike, setDoesUserLike] = useState(false)
    const { user } = useContext(UserContext)
    
    useEffect(() => {
        getUserByUID(commentOwnerUID).then((res: any) => {
            setCommentOwnerInfo(res.docs[0].data())
        })
    }, [commentOwnerUID])

    useEffect(() => {
        setLikesState(likes)
        setDoesUserLike(likes.includes(user.uid))
    }, [])
    const handleCommentLike = () => {
        setLikesState((origin) => {
            const likesTmp = origin.slice()
            axios.post("https://ollim.herokuapp.com/updateCommentLike", {like: doesUserLike, commentDocID: docID, userUID: user.uid})

            if (doesUserLike) {
                const index = likesTmp.indexOf(user.uid)
                setDoesUserLike((origin)=>!origin)
                return likesTmp.splice(index, 1)
            } else {
                likesTmp.push(user.uid)
                setDoesUserLike((origin)=>!origin)
                return likesTmp
            }
        })
    }
    return (
    <AnimatePresence>
        <motion.div layout animate={{opacity:[0,1]} } className="flex flex-col items-start justify-center w-full h-fit border-t border-opacity-10 shadow-md px-3 py-3">
            <div className="flex items-center justify-between mb-3 w-full">
                <div className="flex items-center">
                    <img className="w-7 rounded-full mr-3" src={commentOwnerInfo.profileImg} alt="comment owner" />
                    <span className="text-sm text-gray-500">{commentOwnerInfo.username}</span>
                </div>
                <div className="flex items-center">
                        <span onClick={handleCommentLike} className={`material-icons mr-2 cursor-pointer ${doesUserLike ? "text-red-400" : "text-gray-400"}`}>
                    favorite
                    </span>
                    <span  className={`text-gray-400 text-sm`}>{likesState.length}</span>
                </div>
            </div>
            <textarea value={content} rows={1} readOnly className="w-full h-fit resize-none focus:outline-none" />
        </motion.div>
    </AnimatePresence>
    )
}

export default memo(CommentRow)