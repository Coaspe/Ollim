import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../context/user"
import CustomNodeFlowRDOnly from "../diagram/RelationShipDiagramReadOnly"
import { getUserByEmail, getUserByUID, getWritingInfo } from "../services/firebase"
import {writingType, tableType, gerneType, getFirestorePoem, disclosure, getFirestoreNovel, getFirestoreUser, toObjectElements, alarmType, commentType } from "../type"
import SlateEditor from "../SlateEditor/SlateEditor"
import { cx, css } from "@emotion/css";
import SlateEditorRDOnly from "../SlateEditor/SlateEditorRDOnly"
import { useDispatch, useSelector } from "react-redux"
import { diagramAction, elementsAction } from "../redux"
import { RootState } from "../redux/store"
import { Alert } from "@mui/material"
import { Elements } from "react-flow-renderer"
import { initialValue } from "../SlateEditor/utils"
import WritingSetting from "../components/WritingSetting"
import Header from "../components/Header"
import CommentRow from "../components/CommentRow"
import axios from "axios"
import SpinningSvg from "../components/SpinningSvg"

const Writing = () => {

    const genreMatching = {
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

    // Editor value
    const [value, setValue] = useState(initialValue);
    // Table State 
    const [table, setTable] = useState<tableType>("OVERVIEW")
    // Disclosure State
    const [disclosure, setDisclosure] = useState<disclosure>("PUBLIC")
    // Synopsis State
    const [synopsis, setSynopsis] = useState<string>("")
    // KillingVerse State
    const [killingVerse, setKillingVerse] = useState<string[]>([])
    // Title
    const [title, setTitle] = useState<string>("")

    const dispatch = useDispatch()

    const navigator = useNavigate()

    // ReadOnly Diagram state
    const [readOnlyDiagram, setReadOnlyDiagram] = useState<toObjectElements>({} as toObjectElements)

    //  Diagram variables
    const diagram = useSelector((state: RootState) =>(state.setDiagram.diagram))
    const setDiagram = useCallback((diagram: toObjectElements) => {
        dispatch(diagramAction.setDiagram({diagram}))
    }, [dispatch])
    const [openDiagram, setOpenDiagram] = useState(false)

    // Diagram's elements State
    const setElements = useCallback((elements: Elements<any>) => {
        dispatch(elementsAction.setElements({elements}))
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
        return () => {
            setElements([])
            setDiagram({} as toObjectElements)
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
        if (writingDocID && genre && (table === "OVERVIEW" || table === "WRITE")) {
            getWritingInfo(writingDocID, genre).then((res: any) => {
                if (res.genre.toLocaleLowerCase() !== "poem") {
                    setWritingInfo(res as getFirestoreNovel)
                    setDiagram(res.diagram as toObjectElements)
                    setElements(res.diagram.elements)
                    setReadOnlyDiagram(res.diagram as toObjectElements)
                } else {
                    setWritingInfo(res as getFirestorePoem)
                }
                setKillingVerse(res.killingVerse)
                setSynopsis(res.synopsis)
                setDisclosure(res.disclosure)
                setTitle(res.title)
            })
        }
    }, [table, writingDocID])

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

    // Server check
    const [isServerClosedBtnDisable, setIsServerClosedDisable] = useState(false)
    const [isServerClosedComment, setIsServerClosedComment] = useState("서버 확인")

    const isOpened = () => {
        setIsServerClosedDisable(true)
        axios.get("https://ollim.herokuapp.com/isOpened")
            .then(() => {
                setIsServerClosedComment("서버 열림")
                setIsServerClosedDisable(false)
                setTimeout(() => {
                    setIsServerClosedComment("서버 확인")
                }, 5000)
            })
            .catch(function (error) {
            setIsServerClosedComment("서버 닫힘")
            setIsServerClosedDisable(false)
            setTimeout(() => {
                setIsServerClosedComment("서버 확인")
            }, 5000)
            if (error.response) {
            // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            }
            else if (error.request) {
            // 요청이 이루어 졌으나 응답을 받지 못했습니다.
            // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
            // Node.js의 http.ClientRequest 인스턴스입니다.
            console.log(error.request);
            }
            else {
            // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
            console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }


    return (
        <>
        { Object.keys(writingInfo).length > 0 && uid && genre && writingDocID &&
        <div className="w-full bg-opacity-30 relative writing-container font-noto">

            {/* Alarm */}
            <AnimatePresence>
                {
                    alarm[2] &&
                    <motion.div
                    variants={alertVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{zIndex: 2000}}
                    className="fixed w-1/2 top-5 translate-x-1/2 left-1/4">
                        <Alert severity={alarm[1]}>{alarm[0]}</Alert>
                    </motion.div>
                }
            </AnimatePresence>
            
            {table !== "WRITE" && <Header userInfo={contextUserInfo} />}
            
            {/* Writing title, genre, owner's name,  */}
            <div className="flex flex-col items-start px-20">
                <div className="flex flex-col items-start justify-center font-bold mb-10">
                    <div onClick={()=>{navigator(`/${writingOwnerInfo.uid}`)}} className="flex items-center justify-between mb-5 cursor-pointer">
                        <img className="w-7 rounded-full mr-2" src={writingOwnerInfo.profileImg} alt="writing owner" />
                        <span>{writingOwnerInfo.username}</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-2xl">{writingInfo.title}
                        <span className="text-lg mx-2">·</span>
                        <span className="text-lg">{genreMatching[writingInfo.genre as gerneType]}</span></span>
                    </div>
                </div>
                <div style={{fontSize: "0.75rem", color: "#ada6a2"}} className="flex items-center">
                    <span className={`shadow material-icons cursor-pointer px-1 py-1 rounded-full hover:text-hoverSpanMenu ${table === "OVERVIEW" && "text-hoverSpanMenu shadow-hoverSpanMenu"}`} onClick={()=>{setTable("OVERVIEW")}}>
                    summarize
                    </span>
                    <span onClick={()=>{setTable("BROWSE")}} className={`shadow ml-5 material-icons cursor-pointer px-1 py-1 rounded-full hover:text-hoverSpanMenu ${table === "BROWSE" && "text-hoverSpanMenu shadow-hoverSpanMenu"}`}>
                    play_circle
                    </span>
                    { uid && contextUser.uid === uid &&
                    <>
                        <span onClick={()=>{setTable("WRITE")}} className={`material-icons shadow mx-5 cursor-pointer px-1 py-1 rounded-full ${table === "WRITE" && "text-hoverSpanMenu shadow-hoverSpanMenu"} hover:text-hoverSpanMenu`}>
                        drive_file_rename_outline
                        </span>
                        <span onClick={()=>{setTable("SETTING")}} className={`material-icons shadow cursor-pointer px-1 py-1 rounded-full ${table === "SETTING" && "text-hoverSpanMenu shadow-hoverSpanMenu"} hover:text-hoverSpanMenu`}>
                        settings
                        </span>
                        <button disabled={isServerClosedBtnDisable || isServerClosedComment === "서버 열림" || isServerClosedComment === "서버 닫힘"} onClick={isOpened} 
                            className={`text-white flex flex-col items-center justify-center cursor-pointer ml-5 h-8 rounded-2xl px-2 
                            ${isServerClosedComment === "서버 닫힘" && "bg-red-400"}
                            ${isServerClosedComment === "서버 열림" && "bg-green-400"}
                            ${isServerClosedComment === "서버 확인" && "bg-gray-400"}
                        `}>
                        {isServerClosedBtnDisable ? <SpinningSvg /> : isServerClosedComment}   
                        </button>
                    </>}
                </div>
            </div>
            
            {/* Table OVERVIEW */}
            {
                table === "OVERVIEW" &&
                    (genre?.toLocaleLowerCase() === "poem" ?
                    (
                        <div className="w-full h-screen flex flex-col items-start px-20 mt-20">
                            {/* Synopsis div */}
                            <div className="flex flex-col w-2/3">
                                <span className="text-2xl font-bold mb-10">여는 말</span>
                                <textarea value={writingInfo.synopsis} style={{backgroundColor: "#FAF6F5"}} disabled className="border-opacity-5 border-black shadow-lg px-3 py-3 resize-none border w-full h-72 overflow-y-scroll focus:outline-none">{writingInfo.synopsis}</textarea>
                            </div>
                        </div>
                    ) : (
                    diagram &&
                        <div className="w-full flex flex-col items-start px-20 mt-20">
                            {/* Synopsis div */}
                            <div className="flex flex-col w-2/3">
                                <span className="text-2xl font-bold mb-10">시놉시스</span>
                                <textarea value={writingInfo.synopsis} style={{backgroundColor: "#FAF6F5"}} disabled className="border-opacity-5 border-black shadow-lg px-3 py-3 resize-none border w-full h-72 overflow-y-scroll focus:outline-none">{writingInfo.synopsis}</textarea>
                            </div>
                            {/* diagram div */}
                            <div className="flex flex-col w-2/3 my-20">
                                <span className="text-2xl font-bold mb-10">인물 관계도</span>
                                <CustomNodeFlowRDOnly diagram={readOnlyDiagram} />
                            </div>
                        </div>
                    ))
            }
            
            {/* Table WRITE */}
            {
                table === "WRITE" && uid === contextUser.uid &&
                    <div
                    className={cx(
                        "w-full h-full mt-10 flex flex-col items-center justify-center pb-32 editor-container relative",
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
                            <SlateEditor openDiagram={openDiagram} setOpenDiagram={setOpenDiagram} writingDocID={writingDocID} genre={writingInfo.genre} value={value} setValue={setValue}/>
                    </div>
            }
            
            {/* Table BROWSE */}
            {
                table === "BROWSE" && 
                    <div
                        className={cx(
                            "w-full h-full mt-10 flex flex-col items-center justify-center pb-32 relative",
                            css`
                                :fullscreen {
                                    background-color: #e6ddda;
                                    padding-bottom: 0;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }
                            `
                                )}
                            >
                            <SlateEditorRDOnly writingDocID={writingDocID} genre={writingInfo.genre}/>
                    </div>
            }
            
            {/* Table SETTING */}
            {writingDocID && table === "SETTING" && writingInfo.userUID === contextUser.uid && 
            <WritingSetting
                writingInfo={writingInfo}
                title={title}
                setTitle={setTitle}
                synopsis={synopsis}
                setSynopsis={setSynopsis}
                killingVerse={killingVerse}
                setKillingVerse={setKillingVerse}
                disclosure={disclosure}
                setDisclosure={setDisclosure}
                writingDocID={writingDocID} />}
        </div>}
    </>)
}

export default Writing