import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { memo, useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import UserContext from "../context/user"
import { alarmAction } from "../redux"
import { getUserByUID } from "../services/firebase"
import { alarmType, commentType, getFirestoreUser } from "../type"
import SpinningSvg from "./SpinningSvg"

interface props extends commentType {
    writingDocID: string
    index:number
    genre: string
    setComments: React.Dispatch<React.SetStateAction<any[]>>
}

const CommentRow: React.FC<props> = (
    {
        index,
        content,
        replies,
        likes,
        commentOwnerUID, 
        docID, 
        dateCreated, 
        setComments, 
        writingDocID, 
        genre }) => {

    const [commentOwnerInfo, setCommentOwnerInfo] = useState({} as getFirestoreUser)
    const [likesState, setLikesState] = useState<string[]>([])
    const [doesUserLike, setDoesUserLike] = useState(false)
    const { user } = useContext(UserContext)
    const [commentSettingOpen, setCommentSettingOpen] = useState(false)
    const [deleteBtnDisable, setDeleteBtnDisable] = useState(false)
    const [reportBtnDisable, setReportBtnDisable] = useState(false)
    const [reasonForReport, setResonForReport] = useState("")
    const dispatch = useDispatch()
    const setAlarm = (alarm: [string, alarmType, boolean]) => {
        dispatch(alarmAction.setAlarm({alarm}))
    }
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
            let likesTmp = origin.slice()
            axios.post("https://ollim.herokuapp.com/updateCommentLike", {like: doesUserLike, commentDocID: docID, userUID: user.uid})

            if (doesUserLike) {
                const indexLocal = likesTmp.indexOf(user.uid)
                setDoesUserLike((origin)=>!origin)
                likesTmp.splice(indexLocal, 1)
            } else {
                likesTmp.push(user.uid)
                setDoesUserLike((origin)=>!origin)
            }
            return likesTmp
        })
    }
    const handleCommentDelete = () => {
        setDeleteBtnDisable(true)
        axios.post("https://ollim.herokuapp.com/deleteComment", { commentDocID: docID, writingDocID, genre, dateCreated }).then(() => {
            setComments((origin) => {
                let tmp = origin.slice()
                tmp.splice(index, 1)
                setDeleteBtnDisable(false)
                return tmp
            })
        })
    }
    const handleCommentReport = () => {
        setReportBtnDisable(true)
        axios.post("https://ollim.herokuapp.com/reportComment", {
            reportUID: user.uid,
            reportedUID: commentOwnerUID,
            commentDocID: docID,
            reasonForReport
        }).then((res) => {
            setReportBtnDisable(false)
            setAlarm(res.data)
            setTimeout(()=>{setAlarm(["","success",false])}, 3000)
        })
    }
    return (
    <AnimatePresence>
        <motion.div layout animate={{ opacity:[ 0, 1 ] } } className="flex flex-col items-start justify-center w-full h-fit border-t border-opacity-10 shadow-md px-3 py-3">
            <div className="flex items-center justify-between mb-3 w-full">
                <div className="flex items-center">
                    <img className="w-7 rounded-full mr-3" src={commentOwnerInfo.profileImg} alt="comment owner" />
                    <span className="text-sm text-gray-500">{commentOwnerInfo.username}</span>
                    <span onClick={()=>{setCommentSettingOpen((origin)=>!origin)}} className="material-icons text-gray-500 cursor-pointer hover:text-black">
                    more_vert
                    </span> 
                    <AnimatePresence>
                    {commentSettingOpen &&
                        <motion.div initial={{x:"-30%", opacity:"0%"}} animate={{x:"0%", opacity:"100%"}} exit={{opacity: "0%"}} className="flex items-center">
                            {user.uid === commentOwnerUID &&
                             <button onClick={handleCommentDelete} disabled={deleteBtnDisable}>
                                {!deleteBtnDisable ? 
                                <span className="material-icons cursor-pointer text-gray-500 hover:text-black text-xl">
                                delete
                                </span> : <SpinningSvg />} 
                            </button>}
                            {/*                             
                            <button disabled={reportBtnDisable} className="mr-1" onClick={handleCommentReport} disabled={deleteBtnDisable}>
                             {!reportBtnDisable ?
                            <span className="material-icons cursor-pointer text-gray-500 hover:text-black text-xl">
                            report_problem
                            </span> : <SpinningSvg />} 
                            </button> */}

                        </motion.div>
                    }
                    </AnimatePresence>
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