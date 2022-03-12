import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { alarmAction } from "../redux";
import { alarmType, writingType, disclosure, genre } from "../type";
import { motion, AnimatePresence } from 'framer-motion'
import MypageWritingSetting from "./MypageWritingSetting";
import SpinningSvg from "./SpinningSvg";

interface props {
    writingInfo: writingType
    synopsis: string
    setSynopsis: React.Dispatch<React.SetStateAction<string>>
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    writingDocID: string
    disclosure: string
    setDisclosure: React.Dispatch<React.SetStateAction<disclosure>>
    killingVerse: string[]
    setKillingVerse: React.Dispatch<React.SetStateAction<string[]>>
}

const WritingSetting: React.FC<props> = ({
    writingInfo,
    title,
    setTitle,
    synopsis,
    setSynopsis, 
    writingDocID, 
    disclosure, 
    setDisclosure,
    killingVerse,
    setKillingVerse
}) => {
    const dispatch = useDispatch()
    // Delete modal variables
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteInput, setDeleteInput] = useState("")
    const navigate = useNavigate()
    const setAlarm = (alarm: [string, alarmType, boolean]) => {
        dispatch(alarmAction.setAlarm({alarm}))
    }

    const [titleSaveButtonDisabled, setTitleSaveButtonDisabled] = useState(false)
    const [synopsisSaveButtonDisabled, setSynopsisSaveButtonDisabled] = useState(false)
    const [coverSaveButtonDisabled, setCoverSaveButtonDisabled] = useState(false)
    const [disclosureSaveButtonDisabled, setDisclosureSaveButtonDisabled] = useState(false)
    const [newVerse, setNewVerse] = useState("")

    const variants = {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.1
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.1
            }
        }
    }

    return (
            <div className="w-full font-noto flex flex-col items-start px-20 mt-20">
                {/* Title div */}
                <div className="flex flex-col w-2/3">
                    <div className="flex items-center mb-10">
                        <span className="text-2xl font-bold mr-10">제목</span>
                        <button 
                            disabled={titleSaveButtonDisabled}
                            style={{fontSize: "0.75rem"}}
                            onClick={()=>{
                                if (writingInfo.title !== title) {
                                    setTitleSaveButtonDisabled(true)
                                    axios.post(`https://ollim.herokuapp.com/updateTitle`, { genre: writingInfo.genre, writingDocID, title })
                                        .then((res) => {
                                            setAlarm(res.data)
                                            setTitleSaveButtonDisabled(false)
                                            setTimeout(() => {
                                            setAlarm(["", "success", false]);
                                            }, 2000);
                                    })
                                }
                            }}
                            className="flex items-center justify-center border border-blue-400 px-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100">
                            {titleSaveButtonDisabled ? <SpinningSvg /> : "저장"}
                        </button>
                    </div>
                    <input 
                    style={{backgroundColor: "#FAF6F5",}}
                    value={title}
                    onChange={(e)=>{setTitle(e.target.value)}} 
                    className="border-opacity-5 shadow-lg px-3 py-2 border border-black w-fit overflow-x-scroll focus:outline-none" />
                </div>
                
                {/* Synopsis div */}
                <div className="flex flex-col w-2/3 mt-20">
                    <div className="flex items-center mb-10">
                        <span className="text-2xl font-bold mr-10">{writingInfo.genre !== "POEM" ? "시놉시스" : "여는 말"}</span>
                    <button 
                        style={{fontSize: "0.75rem"}}
                        disabled={synopsisSaveButtonDisabled}
                        onClick={()=>{
                            if (writingInfo.synopsis !== synopsis) {
                                setSynopsisSaveButtonDisabled(true)
                                axios.post(`https://ollim.herokuapp.com/updateSynopsis`, { genre: writingInfo.genre, writingDocID, synopsis })
                                    .then((res) => {
                                        setAlarm(res.data)
                                        setSynopsisSaveButtonDisabled(false)
                                        setTimeout(() => {
                                        setAlarm(["", "success", false]);
                                        }, 2000);
                                })
                            }
                        }}
                        className="border border-blue-400 px-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100">저장</button>
                    </div>
                    <textarea 
                    style={{backgroundColor: "#FAF6F5",}}
                    value={synopsis}
                    onChange={(e)=>{setSynopsis(e.target.value)}} 
                    className="border-opacity-5 shadow-lg resize-none px-3 py-3 border border-black w-full h-72 overflow-y-scroll bg-transparent focus:outline-none">
                        {synopsis}
                    </textarea>
                </div>
                
                {/* Killing verse */}
                <div className="flex flex-col w-full my-20">
                    <div className="flex items-center mb-10">
                        <span className="text-2xl font-bold mr-10">표지</span>
                        <button 
                        disabled={coverSaveButtonDisabled}
                        style={{fontSize: "0.75rem"}}
                        onClick={()=>{
                            if (writingInfo.killingVerse !== killingVerse) {
                                setCoverSaveButtonDisabled(true)
                                axios.post(`https://ollim.herokuapp.com/updateKillingVerse`, { genre: writingInfo.genre, writingDocID, killingVerse: JSON.stringify(killingVerse) })
                                    .then((res) => {
                                        setAlarm(res.data)
                                        setCoverSaveButtonDisabled(false)
                                        setTimeout(() => {
                                        setAlarm(["", "success", false]);
                                        }, 2000);
                                    }).catch((error) => {
                                    console.log(error);
                                })
                            }
                        }}
                        className="border border-blue-400 px-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100">저장</button>
                    </div>
                    <div className="flex items-center w-full">
                        <div className="grid w-1/4">
                            <MypageWritingSetting title={writingInfo.title} genre={writingInfo.genre as genre} killingVerse={killingVerse} synopsis={synopsis} /> 
                        </div>
                        <div style={{borderLeft: "3px"}} className="h-36 mx-10"></div>
                        <div style={{backgroundColor: "#FAF6F5"}} className="flex flex-col justify-between w-1/3 h-72 border-black border border-opacity-5 shadow-lg rounded-lg px-10 py-5">
                            <AnimatePresence>
                                <motion.div layout className="flex flex-col gap-2">
                                    {killingVerse.map((verse, index) => (
                                        <motion.div className="flex items-center" layout key={`${verse}+${index}`} variants={variants} initial="initial" animate="animate" exit="exit">
                                            <div className="flex w-full items-center justify-between shadow-md border border-gray-200 px-3 py-2 rounded-2xl">
                                                {verse}
                                            </div>
                                            <span onClick={() => {
                                                setKillingVerse((origin) => {
                                                    let tmp = origin.slice()
                                                    tmp.splice(index, 1)
                                                    return tmp
                                                })
                                            }} 
                                            className="mx-4 material-icons text-red-400 rounded-full cursor-pointer hover:bg-red-100">
                                            highlight_off
                                            </span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        
                            {/* New verse div */}
                            <div key="new verse" className="flex items-center">
                                <input spellCheck={false} className="shadow-md w-full border-gray-200 border px-3 py-1 rounded-2xl bg-transparent focus:outline-gray-500" onChange={(e) => { setNewVerse(e.target.value) }} type="text" value={newVerse} />
                                <span onClick={() => {
                                    setKillingVerse((origin) => {
                                        let tmp = origin.slice()
                                        tmp.push(newVerse)
                                        return tmp
                                    })
                                    setNewVerse("")
                                    }}
                                    className="mx-4 material-icons text-green-400 rounded-full cursor-pointer hover:bg-green-100" >
                                    add_circle_outline
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Disclosure div */}
                <div className="flex flex-col items-start w-1/3 my-20">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold mr-10">공개 범위</span>
                        <button 
                        disabled={disclosureSaveButtonDisabled}
                        style={{fontSize: "0.75rem"}}
                        onClick={()=>{
                            if (writingInfo.disclosure !== disclosure ) {
                                setDisclosureSaveButtonDisabled(true)
                                axios.post(`https://ollim.herokuapp.com/updateDisclosure`, { genre:writingInfo.genre, writingDocID, disclosure })
                                    .then((res) => {
                                        setAlarm(res.data)
                                        setDisclosureSaveButtonDisabled(false)
                                        setTimeout(() => {
                                        setAlarm(["", "success", false]);
                                        }, 2000);
                                    })
                            }
                        }}
                        className="border border-blue-400 px-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100">저장</button>
                    </div>
                    <div className="w-full flex items-center justify-between mt-5 py-2 px-3">
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG ${disclosure === "PUBLIC" && "bg-genreSelectedBG shadow-genreSelectedBG shadow-md"}`} onClick={()=>{setDisclosure("PUBLIC")}}>모두</motion.button>
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG ${disclosure === "FOLLOWERS" && "bg-genreSelectedBG shadow-genreSelectedBG shadow-md"}`} onClick={()=>{setDisclosure("FOLLOWERS")}}>팔로워</motion.button>
                        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG ${disclosure === "PRIVATE" && "bg-genreSelectedBG shadow-genreSelectedBG shadow-md"}`} onClick={()=>{setDisclosure("PRIVATE")}}>비공개</motion.button>
                    </div>
                </div>

                {/* Delete */}
                {
                    deleteModalOpen && 
                    <motion.div
                    style={{zIndex: 10000}}
                    animate={{
                        backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
                    }}
                    transition={{ duration: 0.2 }}
                    className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
                    onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModalOpen(false);
                        setDeleteInput("")
                    }}
                    >
                        <div onClick={(e)=>{e.stopPropagation();}} className="flex items-center justify-center h-fit bg-white px-10 py-10">
                            <div className="flex flex-col">
                                <span className="text-2xl mb-5 text-red-500 font-bold">경고</span>
                                <span>삭제 시 복구가 불가능 합니다.</span>
                                <span>그럼에도 삭제를 원하신다면 <span className="text-xl font-bold">{writingInfo.title}</span> 을 입력해주세요.</span>
                                <div className="mt-5">
                                    <input spellCheck={false} value={deleteInput} onChange={(e)=>{setDeleteInput(e.target.value)}} className="border mr-5 px-2 py-2 rounded-xl focus:outline-none" type="text" />
                                    <button
                                    onClick={()=>{
                                        axios.post(`https://ollim.herokuapp.com/deleteWriting`, {
                                            writingDocID,
                                            genre: writingInfo.genre
                                        }).then((res) => {
                                            setAlarm(res.data)
                                            setDeleteModalOpen(false)
                                            res.data[1] === "success" && navigate(`/${writingInfo.userUID}`) 
                                            setTimeout(()=>{setAlarm(["", "success", false])}, 3000)
                                        })
                                    }}
                                    disabled={deleteInput !== writingInfo.title}
                                    className={`border px-2 py-2 text-center rounded-full text-sm ${deleteInput === writingInfo.title && "text-red-500"} `}>삭제</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                }
                <div className="flex flex-col items-start w-1/3 my-20">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold mb-10">글 삭제</span>
                        <button className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG ${disclosure === "PUBLIC" && "bg-genreSelectedBG"}`} onClick={()=>{setDeleteModalOpen(true)}}>삭제 하기</button>
                    </div>
                </div>
            </div>
        )
}

export default WritingSetting