import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import UserContext from "../context/user"
import CustomNodeFlowRDOnly from "../diagram/RelationShipDiagramReadOnly"
import { getDiagram, getUserByEmail, getUserByUID, getWritingInfo } from "../services/firebase"
import {writingType, tableType, gerneType, getFirestorePoem, disclosure, getFirestoreNovel, getFirestoreUser, toObjectElements, alarmType } from "../type"
import SlateEditor from "../SlateEditor/SlateEditor"
import { cx, css } from "@emotion/css";
import SlateEditorRDOnly from "../SlateEditor/SlateEditorRDOnly"
import { useDispatch, useSelector } from "react-redux"
import { alarmAction, diagramAction, elementsAction } from "../redux"
import { RootState } from "../redux/store"
import { Alert } from "@mui/material"
import { Elements } from "react-flow-renderer"

const Writing = () => {

    const gerneMatching = {
        NOVEL: "소설",
        POEM: "시",
        SCENARIO: "시나리오"
    }

    // User Info Variables
    const { uid, genre, writingDocID } = useParams()
    const { user: contextUser } = useContext(UserContext)
    const [ contextUserInfo, setContextUserInfo ] = useState<getFirestoreUser>({} as getFirestoreUser)
    const [writingOwnerInfo, setWritingOwnerInfo] = useState<getFirestoreUser>({} as getFirestoreUser)
    const [writingInfo, setWritingInfo] = useState<writingType>({} as writingType)

    // Table State 
    const [table, setTable] = useState<tableType>("OVERVIEW")
    // Disclosure State
    const [disclosure, setDisclosure] = useState<disclosure>("PUBLIC")
    // Synopsis State
    const [synopsis, setSynopsis] = useState<string>("")
    const dispatch = useDispatch()

    //  Diagram variables
    const diagram = useSelector((state: RootState) =>(state.setDiagram.diagram))
    const setDiagram = useCallback((diagram: toObjectElements) => {
        dispatch(diagramAction.setDiagram({diagram}))
    }, [dispatch])
    const [openDiagram, setOpenDiagram] = useState(false)

    // Diagram's elements State
    const setElements = useCallback((elements: Elements<any>) => {
        dispatch(elementsAction.setElements({elements: elements}))
    }, [dispatch])

    // alarm state
    // alarm[0] : alarm message, alarm[1] : alarm type, alarm[2] : alarm on, off
    const alarm = useSelector((state: RootState) => state.setAlarm.alarm)

    // useEffect to get context user's information
    useEffect(() => {
        if (contextUser.email) {
            getUserByEmail(contextUser.email as string).then((res) => {
                setContextUserInfo(res.data() as getFirestoreUser)
            })
        }
    }, [contextUser.email])

    // useEffect to get writing's owner's information
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
                    setElements(res.diagram.elements)
                    setSynopsis(res.synopsis)
                } else {
                    setWritingInfo(res as getFirestorePoem)
                    setSynopsis(res.opening)
                }
                setDisclosure(res.disclosure)
            })
        }
    }, [writingDocID, genre])

    const alertVariants = {
        initial: {
            opacity: 0,
            y:-10
        },
        animate: {
            opacity: 1,
            y:0
        },
        exit: {
            opacity: 0,
            y:-10
        }
    }
    return (
        <>
        { Object.keys(writingInfo).length > 0 && <div className=" w-full bg-[#e6d6d1] bg-opacity-30 relative writing-container">
        <AnimatePresence>
            {
                alarm[2] &&
                <motion.div
                variants={alertVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="fixed w-1/2 top-5 translate-x-1/2 left-1/4 z-[2000]">
                    <Alert severity={alarm[1]}>{alarm[0]}</Alert>
                </motion.div>
            }
        </AnimatePresence>
        {table !== "WRITE" && <div className="flex w-full font-noto items-center justify-between px-20">
            {/* logo */}
            <img className="h-28" src="/logo/Ollim-logos_transparent.png" alt="header logo" />
            {contextUserInfo.profileImg && 
            <div className="flex items-center">
                <img className="rounded-full w-10" src={contextUserInfo.profileImg} alt="header profile" />
                <span className="font-bold ml-3">{contextUserInfo.username}</span>
            </div>}
        </div>}
        <div className="flex font-noto flex-col items-start px-20">
            <div className="flex items-center font-bold mb-10">
                <span className="text" >{writingOwnerInfo.username}</span>
                <span className="text-xl mx-1" > -</span>
                <span className="text-sm " >{gerneMatching[writingInfo.genre as gerneType]}</span>
                <span className="text-xl mx-1" >- </span>
                <span className="text-2xl ">{writingInfo.title}</span>
            </div>
            <div className="flex items-center text-[0.75rem] text-blue-400">
                <button className={`border border-blue-400 px-3 py-1 rounded-xl ${table === "OVERVIEW" && "bg-blue-50"} hover:bg-blue-100`} onClick={()=>{setTable("OVERVIEW")}}>개요</button>
                <button onClick={()=>{setTable("BROWSE")}} className={`ml-5 border border-blue-400 px-3 py-1 rounded-xl ${table === "BROWSE" && "bg-blue-50"} hover:bg-blue-100`} >열람</button>
                { contextUser.uid === uid &&
                <>
                    <button onClick={()=>{setTable("WRITE")}} className={`mx-5 border border-blue-400 px-3 py-1 rounded-xl ${table === "WRITE" && "bg-blue-50"} hover:bg-blue-100`}>작성</button>
                    <button onClick={()=>{setTable("SETTING")}} className={`border border-blue-400 px-3 py-1 rounded-xl ${table === "SETTING" && "bg-blue-50"} hover:bg-blue-100`}>설정</button>
                </>}
            </div>
        </div>
        {/* Table OVERVIEW */}
        {
            table === "OVERVIEW" &&
                (genre?.toLocaleLowerCase() === "poem" ?
                (
                    <div className="w-full font-noto flex flex-col items-start px-20 mt-20">
                        {/* Synopsis div */}
                        <div className="flex flex-col w-2/3">
                            <span className="text-2xl font-bold mb-10">여는 말</span>
                            <p className="px-3 py-3 border border-blue-400 w-full h-72 overflow-y-scroll rounded-lg">{(writingInfo as getFirestorePoem).opening}</p>
                        </div>
                    </div>
                ) : (
                diagram &&
                    <div className="w-full font-noto flex flex-col items-start px-20 mt-20">
                        {/* Synopsis div */}
                        <div className="flex flex-col w-2/3">
                            <span className="text-2xl font-bold mb-10">시놉시스</span>
                            <p className="px-3 py-3 border border-blue-400 w-full rounded-lg h-72 overflow-y-scroll">{(writingInfo as getFirestoreNovel).synopsis}</p>
                        </div>
                        {/* diagram div */}
                        <div className="flex flex-col w-2/3 my-20">
                            <span className="text-2xl font-bold mb-10">인물 관계도</span>
                            <CustomNodeFlowRDOnly diagram={diagram} />
                        </div>
                    </div>
                ))
        }
        {/* Table WRITE */}
        {
            table === "WRITE" && uid === contextUser.uid &&
                <div
                    className={cx(
                        "w-full h-full mt-10 flex flex-col items-center justify-center pb-32 editor-container",
                        css`
                            :fullscreen {
                                background-color: #e6ddda;
                                padding-bottom: 0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        `
                        )}>
                        <SlateEditor openDiagram={openDiagram} setOpenDiagram={setOpenDiagram} writingDocID={writingDocID} genre={writingInfo.genre}/>
                </div>
        }
        {/* Table BROWSE */}
        {
            table === "BROWSE" && 
                <div
                    className={cx(
                        "w-full h-full mt-10 flex flex-col items-center justify-center pb-32 editor-container",
                        css`
                            :fullscreen {
                                background-color: #e6ddda;
                                padding-bottom: 0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        `
                        )}>
                        <SlateEditorRDOnly openDiagram={openDiagram} setOpenDiagram={setOpenDiagram} writingDocID={writingDocID} genre={writingInfo.genre}/>
                </div>
        }
        {/* Table SETTING */}
        {
            table === "SETTING" && uid === contextUser.uid &&
            <div className="w-full font-noto flex flex-col items-start px-20 mt-20">
                {/* Synopsis div */}
                    <div className="flex flex-col w-2/3">
                    <span className="text-2xl font-bold mb-10">시놉시스</span>
                    <textarea 
                    onChange={(e)=>{setSynopsis(e.target.value)}} 
                    className="resize-none px-3 py-3 border border-blue-400 w-full rounded-lg h-72  bg-transparent focus:outline-none">
                        {synopsis}
                    </textarea>
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
        </div>}
    </>)
}

export default Writing