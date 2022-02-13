import { AnimatePresence, motion } from "framer-motion"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Editor from "../components/Editor"
import UserContext from "../context/user"
import CustomNodeFlow from "../diagram/RelationShipDiagram"
import CustomNodeFlowRDOnly from "../diagram/RelationShipDiagramReadOnly"
import { getUserByEmail, getUserByUID, getWritingInfo } from "../services/firebase"
import { getFirestorePoem, getFirestoreNovel, getFirestoreScenario, getFirestoreUser, toObjectElements } from "../type"
import axios from 'axios'
const Writing = () => {
    type writingType = getFirestorePoem | getFirestoreNovel | getFirestoreScenario
    type tableType = "OVERVIEW" | "WRITE" | "SETTING"
    type gerneType = "NOVEL" | "POEM" | "SCENARIO"
    const gerneMatching = {
        NOVEL: "소설",
        POEM: "시",
        SCENARIO: "시나리오"
    }
    const { uid, genre, writingDocID } = useParams()
    const { user: contextUser } = useContext(UserContext)
    const [ contextUserInfo, setContextUserInfo ] = useState<getFirestoreUser>({} as getFirestoreUser)
    const [writingOwnerInfo, setWritingOwnerInfo] = useState<getFirestoreUser>({} as getFirestoreUser)
    const [writingInfo, setWritingInfo] = useState<writingType>({} as writingType)
    const [table, setTable] = useState<tableType>("OVERVIEW")
    const [diagram, setDiagram] = useState<toObjectElements>({} as toObjectElements)
    const [openDiagram, setOpenDiagram] = useState(false)
    
    useEffect(() => {
        if (contextUser.email) {
            getUserByEmail(contextUser.email as string).then((res) => {
                setContextUserInfo(res.data() as getFirestoreUser)
            })
        }
    }, [contextUser.email])

    useEffect(() => {
        if (uid) {
            getUserByUID(uid).then((res) => {
                setWritingOwnerInfo(res.docs[0].data() as getFirestoreUser)
            })
        }
    }, [uid])

    useEffect(() => {
        if (writingDocID && genre) {
            getWritingInfo(writingDocID, genre).then((res: any) => {
                if (res.gerne !== "poem") {
                    setWritingInfo(res as getFirestoreNovel)
                    setDiagram(res.diagram as toObjectElements)
                } else {
                    setWritingInfo(res as getFirestorePoem)
                }
            })
        }
    }, [writingDocID, genre])
    useEffect(() => {
        console.log(process.env.NODE_ENV);
        
        const serchNaver = (q: string) => {
            axios.post('http://localhost:3001/searchWord', {q}).then((res: any)=>{console.log(res.data.channel.item);
            })
        };
        serchNaver("나분")
    },[])
    return (
    <div className="relative w-full bg-gradient-to-b from-[#e4d0ca] to-transparent bg-opacity-30">
        <div className="flex w-full font-noto items-center justify-between px-20">
            {/* logo */}
            <img className="h-28" src="/logo/Ollim-logos_transparent.png" alt="header logo" />
            {contextUserInfo.profileImg && 
            <div className="flex items-center">
                <img className="rounded-full w-10" src={contextUserInfo.profileImg} alt="header profile" />
                <span className="font-bold ml-3">{contextUserInfo.username}</span>
            </div>}
        </div>
        <div className="flex font-noto flex-col items-start px-20">
            <div className="flex items-center font-bold mb-10">
                <span className="text" >{writingOwnerInfo.username}</span>
                <span className="text-xl mx-1" > -</span>
                <span className="text-sm " >{gerneMatching[writingInfo.genre as gerneType]}</span>
                <span className="text-xl mx-1" >- </span>
                <span className="text-2xl ">{writingInfo.title}</span>
            </div>
            <div className="flex items-center">
                <button onClick={()=>{setTable("OVERVIEW")}}>개요</button>
                <button onClick={()=>{setTable("WRITE")}} className="mx-5">작성</button>
                <button onClick={()=>{setTable("SETTING")}} >설정</button>
            </div>
        </div>
        {
            table === "OVERVIEW" &&
                (genre === "poem" ?
                (
                <div>
                    <div className="w-full font-noto flex flex-col items-start px-20 mt-20">
                        {/* Synopsis div */}
                        <div className="flex flex-col w-2/3">
                            <span className="text-2xl font-bold mb-10">여는 말</span>
                            <p className="px-3 py-3 border border-blue-400 w-full rounded-lg">{(writingInfo as getFirestoreNovel).synopsis}</p>
                        </div>
                    </div>
                </div>
                ) : (
                diagram &&
                <div>
                    <div className="w-full font-noto flex flex-col items-start px-20 mt-20">
                        {/* Synopsis div */}
                        <div className="flex flex-col w-2/3">
                            <span className="text-2xl font-bold mb-10">시놉시스</span>
                            <p className="px-3 py-3 border border-blue-400 w-full rounded-lg">{(writingInfo as getFirestoreNovel).synopsis}</p>
                        </div>
                        {/* diagram div */}
                        <div className="flex flex-col w-2/3 my-20">
                            <span className="text-2xl font-bold mb-10">인물 관계도</span>
                            <CustomNodeFlowRDOnly diagram={diagram} />
                        </div>
                    </div>
                </div>
                ))
        }
        <AnimatePresence>
                {openDiagram && 
                <motion.div animate={{ y: ["100%", "0%"] }} exit={{ y: ["0%", "100%"] }} transition={{ y: { duration: 0.3 } }} className="z-50 bottom-0 fixed w-full h-1/3 bg-white">
                    <CustomNodeFlow />
                </motion.div>}
        </AnimatePresence>
        {
            table === "WRITE" &&
            <div className="w-full h-screen mt-20 flex items-center justify-center pb-32">
                <Editor textProps="" setOpenDiagram={setOpenDiagram}/>
            </div>
        }
    </div>)
}

export default Writing