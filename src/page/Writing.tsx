import { AnimatePresence, motion } from "framer-motion"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import UserContext from "../context/user"
import CustomNodeFlow from "../diagram/RelationShipDiagram"
import CustomNodeFlowRDOnly from "../diagram/RelationShipDiagramReadOnly"
import { getUserByEmail, getUserByUID, getWritingInfo } from "../services/firebase"
import {writingType, tableType, gerneType, getFirestorePoem, disclosure, getFirestoreNovel, getFirestoreUser, toObjectElements } from "../type"
import SlateEditor from "../SlateEditor/SlateEditor"

const Writing = () => {

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
    const [disclosure, setDisclosure] = useState<disclosure>("PUBLIC")

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
                setDisclosure(res.disclosure)
            })
        }
    }, [writingDocID, genre])

    return (
    <div className=" w-full bg-gradient-to-b from-[#e4d0ca] to-transparent bg-opacity-30">
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
                    <div className="w-full font-noto flex flex-col items-start px-20 mt-20">
                        {/* Synopsis div */}
                        <div className="flex flex-col w-2/3">
                            <span className="text-2xl font-bold mb-10">여는 말</span>
                            <p className="px-3 py-3 border border-blue-400 w-full rounded-lg">{(writingInfo as getFirestoreNovel).synopsis}</p>
                        </div>
                    </div>
                ) : (
                diagram &&
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
            <div className="w-full h-full mt-20 flex flex-col items-center justify-center pb-32">
                <SlateEditor openDiagram={openDiagram} setOpenDiagram={setOpenDiagram}/>
                {/* <DraftEditor /> */}
            </div>
        }
        {
            table === "SETTING" &&
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
                        
                <div className="flex flex-col items-start w-1/3 mb-20">
                    <span className="text-2xl font-black">공개 범위</span>
                    <div className="w-full flex items-center justify-between mt-5 py-2 px-3">
                        <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "PUBLIC" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("PUBLIC")}}>모두</button>
                        <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "FOLLOWERS" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("FOLLOWERS")}}>팔로워</button>
                        <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "PRIVATE" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("PRIVATE")}}>비공개</button>
                    </div>
                </div>
            </div>
        }
            {/* {pos[0] > -1 && searchVisible &&
                <div style={{ top: pos[1], left: pos[0] }} className={`z-50 absolute select-none`}>
                <svg x="0px" y="0px"
                    viewBox="0 0 487.95 487.95"
                    className="w-8 rounded-full bg-slate-300 px-2 py-2"
                >
                <g>
                    <g>
                        <path d="M481.8,453l-140-140.1c27.6-33.1,44.2-75.4,44.2-121.6C386,85.9,299.5,0.2,193.1,0.2S0,86,0,191.4s86.5,191.1,192.9,191.1
                            c45.2,0,86.8-15.5,119.8-41.4l140.5,140.5c8.2,8.2,20.4,8.2,28.6,0C490,473.4,490,461.2,481.8,453z M41,191.4
                            c0-82.8,68.2-150.1,151.9-150.1s151.9,67.3,151.9,150.1s-68.2,150.1-151.9,150.1S41,274.1,41,191.4z"/>
                    </g>
                </g>
                </svg>
            </div>} */}
    </div>)
}

export default Writing