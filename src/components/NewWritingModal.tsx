import { motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { Elements } from "react-flow-renderer";
import { useDispatch } from "react-redux";
import CustomNodeFlow from "../diagram/RelationShipDiagram";
import { elementsAction } from "../redux";

interface NewWritingProps {
    setNewWritingModalOpen:React.Dispatch<React.SetStateAction<boolean>>
}
const NewWritingModal: React.FC<NewWritingProps> = ({ setNewWritingModalOpen }) => {
    const [page, setPage] = useState(1)
    const [genrn, setGenrn] = useState("")
    const [genrnError, setGenrnError] = useState(false)
    const dispatch = useDispatch()
    const [title, setTitle] = useState("")
    const [titleError, setTitleError] = useState(false)

    const [synopsis, setSynopsis] = useState("")
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
            {page === 1 && 
            <div onClick={(e) => { e.stopPropagation() }} className="relative w-1/2 h-3/4 py-5 px-5 flex flex-col items-center rounded-xl bg-[#faf6f5]">
                {/* right arrow */}
                <motion.svg whileHover={{ y: "-10%" }} x="0px" y="0px"
                    className={`w-8 absolute top-5 right-5 cursor-pointer`}
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
                            setPage(2)
                        }
                    }}
                    viewBox="0 0 50 50">
                    <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z"/><path d="M24.7 34.7l-1.4-1.4 8.3-8.3-8.3-8.3 1.4-1.4 9.7 9.7z"/><path d="M16 24h17v2H16z"/>
                </motion.svg>

                {/* Genrn div */}
                <div className="flex flex-col items-start justify-between w-3/4">
                    <div className="flex items-center">
                        <span className="text-2xl font-black">장르</span>
                        {genrnError && <motion.span className="text-sm ml-2 font-bold text-red-400" animate={{ opacity: [0, 1] }} transition={{ duration: 0.1 }}>장르를 선택해주세요!</motion.span>}
                    </div>
                    <div className="flex items-center justify-between mt-5 w-1/2">
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "novel" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("novel")
                                handleGenrnError()
                            }}>소설</span>
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "poem" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("poem")
                                handleGenrnError()
                            }}>시</span>
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "scenario" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("scenario")
                                handleGenrnError()
                            }}>시나리오</span>
                    </div>
                </div>

                {/* Title, Description div */}
                <div className="mt-10 flex flex-col items-start w-3/4">
                    <div className="flex items-center">
                        <span className="text-2xl font-black">제목</span>
                        {titleError && <motion.span className="text-sm ml-2 font-bold text-red-400" animate={{ opacity: [0, 1] }} transition={{ duration: 0.1 }}>제목을 입력해주세요!</motion.span>}
                    </div>
                    <input className="text-lg font-md border-2 border-[#e4d0ca] py-2 px-3 mt-5 rounded-xl w-1/2 "
                        placeholder="제목을 입력해주세요"
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value)
                            e.target.value && handleTitleError()
                        }} />
                        
                </div>

                {/* Opening article div */}
                <div className="mt-10 flex flex-col items-start w-3/4">
                    <span className="text-2xl font-black">시놉시스</span>
                    <textarea className="resize-none border-2 border-[#e4d0ca] py-2 px-3 mt-5 rounded-xl h-28 w-full italic" placeholder="간략한 줄거리를 서술해주세요." value={synopsis} spellCheck="false" onChange={(e) => { setSynopsis(e.target.value) }} />
                </div>
            </div>}

            {/* (if Novel and Scenario) Second page: Decide Characters relationships diagram */}
            {page === 2 &&
            <div onClick={(e) => { e.stopPropagation() }} className="relative w-1/2 h-3/4 py-5 px-5 flex flex-col items-center rounded-xl bg-[#faf6f5]">

                {/* arrow div */}
                <div className="absolute top-5 right-5 z-20 flex items-center justify-between">

                    {/* left arrow */}
                    <motion.svg whileHover={{ y: "-10%" }} x="0px" y="0px"
                        className={`w-8 cursor-pointer`}
                        onClick={() => {
                        setPage((origin)=>origin-1)
                        }}
                         viewBox="0 0 50 50">
                        <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z"/><path d="M25.3 34.7L15.6 25l9.7-9.7 1.4 1.4-8.3 8.3 8.3 8.3z"/><path d="M17 24h17v2H17z"/>
                    </motion.svg>

                    {/* right arrow */}
                    <motion.svg whileHover={{ y: "-10%" }} x="0px" y="0px"
                        className={`w-8 cursor-pointer`}
                        onClick={() => {
                        setPage((origin)=>origin+1)
                        }}
                         viewBox="0 0 50 50">
                        <path d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z"/><path d="M24.7 34.7l-1.4-1.4 8.3-8.3-8.3-8.3 1.4-1.4 9.7 9.7z"/><path d="M16 24h17v2H16z"/>
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