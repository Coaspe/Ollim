import { motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { Elements } from "react-flow-renderer";
import { useDispatch, useSelector } from "react-redux";
import CustomNodeFlow from "../diagram/RelationShipDiagram";
import { elementsAction } from "../redux";
import { RootState } from "../redux/store";
import { addPoem, addNovel, addScenario } from "../services/firebase";
import { addNovelScenarioArg, addPoemArg, genre, page, disclosure } from "../type";

interface NewWritingProps {
    setNewWritingModalOpen:React.Dispatch<React.SetStateAction<boolean>>
}
const NewWritingModal: React.FC<NewWritingProps> = ({ setNewWritingModalOpen }) => {

    const [page, setPage] = useState<page>("MAIN")
    const [genrn, setGenrn] = useState<genre>("NOVEL")
    const [genrnError, setGenrnError] = useState(false)
    const [title, setTitle] = useState("")
    const [titleError, setTitleError] = useState(false)
    const [synopsis, setSynopsis] = useState("")
    const [disclosure, setDisclosure] = useState<disclosure>("PUBLIC")
    const dispatch = useDispatch()
    const userInfo = useSelector((state: RootState) => state.setUserInfo.userInfo)
    const diagram = useSelector((state: RootState) => state.setDiagram.diagram)
    const setElements = useCallback((elements: Elements<any>) => {
      dispatch(elementsAction.setElements({elements: elements}))
    }, [dispatch])

    useEffect(() => {
        document.body.style.overflow = "hidden"
        
        return () => {
            document.body.style.overflow = "visible"
            setElements([])
        }
    }, [])
    const handleGenrnError = () => {
        genrnError && setGenrnError(false)
    }
    const handleTitleError = () => {
        titleError && setTitleError(false)
    }
    return (
        <motion.div onClick={() => {setNewWritingModalOpen(false)}} className="font-noto flex items-center justify-center z-20 fixed w-full h-full" animate={{ backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"] }} transition={{ duration: 0.2, ease: "easeIn" }}>
            
            {/* First page: Decide Gerne, Title, Synopsis*/}
            {page === "MAIN" && userInfo &&
            <div onClick={(e) => { e.stopPropagation() }} className="relative w-1/2 h-3/4 py-5 px-5 flex flex-col items-center rounded-xl bg-[#faf6f5]">

                {/* right arrow (scenario, novel) or confirm svg (poem) */}
                {genrn !== 'POEM' ?
                <motion.svg whileHover={{ y: "-10%" }} x="0px" y="0px" className={`w-8 absolute top-5 right-5 cursor-pointer`}
                    onClick={() => {
                        if (!genrn && !title) {
                            setGenrnError(true)
                            setTitleError(true)
                        } else if (!genrn) {
                            setGenrnError(true)
                            handleTitleError()
                        } else if (!title) {
                            setTitleError(true)
                            handleGenrnError()
                        } else {
                            setPage("DIAGRAM")
                        }
                    }}
                    viewBox="0 0 50 50">
                        <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z" />
                        <path d="M24.7 34.7l-1.4-1.4 8.3-8.3-8.3-8.3 1.4-1.4 9.7 9.7z" /><path d="M16 24h17v2H16z" />
                </motion.svg>
                        : 
                <motion.svg whileHover={{ y: "-10%" }} x="0px" y="0px" className={`w-8 absolute top-5 right-5 cursor-pointer`} viewBox="0 0 50 50"
                    onClick={() => {
                        if (!genrn && !title) {
                            setGenrnError(true)
                            setTitleError(true)
                        } else if (!genrn) {
                            setGenrnError(true)
                            handleTitleError()
                        } else if (!title) {
                            setTitleError(true)
                            handleGenrnError()
                        } else {
                            // Send firestore post
                            const data: addPoemArg = {
                                userUID: userInfo.uid,
                                userEmail: userInfo.userEmail,
                                title,
                                disclosure,
                                opening: synopsis
                            }
                            addPoem(data)
                            setNewWritingModalOpen(false)
                        }
                    }}
                >
                    <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z"/>
                    <path d="M23 32.4l-8.7-8.7 1.4-1.4 7.3 7.3 11.3-11.3 1.4 1.4z"/>
                </motion.svg>
                }
                
                {/* Genrn div */}
                <div className="flex flex-col items-start justify-between w-3/4">
                    <div className="flex items-center">
                        <span className="text-2xl font-black">장르</span>
                        {genrnError && <motion.span className="text-sm ml-2 font-bold text-red-400" animate={{ opacity: [0, 1] }} transition={{ duration: 0.1 }}>장르를 선택해주세요!</motion.span>}
                    </div>
                    <div className="flex items-center justify-between mt-5 w-1/2">
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "NOVEL" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("NOVEL")
                                handleGenrnError()
                            }}>소설</span>
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "POEM" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("POEM")
                                handleGenrnError()
                            }}>시</span>
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "SCENARIO" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("SCENARIO")
                                handleGenrnError()
                            }}>시나리오</span>
                    </div>
                </div>

                {/* Title div */}
                <div className="mt-10 flex w-3/4 items-center">
                    <div className="flex flex-col items-start w-1/2 h-full">
                        <div className="flex items-center">
                            <span className="text-2xl font-black">제목</span>
                            {titleError && <motion.span className="text-sm ml-2 font-bold text-red-400" animate={{ opacity: [0, 1] }} transition={{ duration: 0.1 }}>제목을 입력해주세요!</motion.span>}
                        </div>
                        <input className="text-lg font-md border-2 border-[#e4d0ca] py-2 px-3 mt-5 rounded-xl w-full placeholder:italic"
                            placeholder="제목을 입력해주세요."
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                e.target.value && handleTitleError()
                            }} />
                        </div>
                        <div className="flex flex-col items-start w-1/2 h-full">
                            <span className="text-2xl font-black">공개 범위</span>
                            <div className="w-full flex items-center justify-between mt-5 py-2 px-3">
                                <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "PUBLIC" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("PUBLIC")}}>모두</button>
                                <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "FOLLOWERS" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("FOLLOWERS")}}>팔로워</button>
                                <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "PRIVATE" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("PRIVATE")}}>비공개</button>
                            </div>
                        </div>
                </div>

                {/* Opening article div */}
                <div className="mt-10 flex flex-col items-start w-3/4">
                    <span className="text-2xl font-black">{genrn === 'POEM' ? "여는 말" : "시놉시스"}</span>
                    <textarea className="resize-none border-2 border-[#e4d0ca] py-2 px-3 mt-5 rounded-xl h-28 w-full italic" placeholder={genrn === 'POEM' ? "전시될 여는말을 서술해주세요." : "전시될 시놉시스를 간략하게 서술해주세요."} value={synopsis} spellCheck="false" onChange={(e) => { setSynopsis(e.target.value) }} />
                </div>
            </div>}

            {/* (if Novel and Scenario) Second page: Decide Characters relationships diagram */}
            {page === "DIAGRAM" && (genrn === "SCENARIO" || genrn === "NOVEL") &&
            <div onClick={(e) => { e.stopPropagation() }} className="relative w-1/2 h-3/4 py-5 px-5 flex flex-col items-center rounded-xl bg-[#faf6f5]">

                {/* arrow div */}
                <div className="absolute top-5 right-5 z-20 flex items-center justify-between">

                    {/* left arrow */}
                    <motion.svg whileHover={{ y: "-10%" }} x="0px" y="0px"
                        className={`w-8 cursor-pointer`}
                        onClick={() => {
                        setPage("MAIN")
                        }}
                         viewBox="0 0 50 50">
                        <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z"/><path d="M25.3 34.7L15.6 25l9.7-9.7 1.4 1.4-8.3 8.3 8.3 8.3z"/><path d="M17 24h17v2H17z"/>
                    </motion.svg>

                    {/* right arrow */}
                    <motion.svg whileHover={{ y: "-10%" }} x="0px" y="0px"
                        className={`w-8 cursor-pointer`}
                        onClick={() => {
                            const data: addNovelScenarioArg = {
                                userEmail: userInfo.userEmail,
                                userUID: userInfo.uid,
                                title,
                                synopsis,
                                disclosure,
                                diagram
                            }
                            genrn === "NOVEL" ? addNovel(data) : addScenario(data)
                            setNewWritingModalOpen(false)
                        }}
                         viewBox="0 0 50 50">
                        <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z"/>
                        <path d="M23 32.4l-8.7-8.7 1.4-1.4 7.3 7.3 11.3-11.3 1.4 1.4z"/>
                    </motion.svg>
                    </div>
                
                {/* Characters relationships diagram*/}
                <span className="abosolute left-1/2 top-5 font-black text-2xl">인물관계도</span>
                <CustomNodeFlow />
            </div>}
            
            {/* {page === 3 &&} */}
        </motion.div>
    )
}

export default NewWritingModal