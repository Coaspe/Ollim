import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { alarmAction } from "../redux";
import { alarmType, writingType, disclosure } from "../type";
import { motion } from 'framer-motion'

interface props {
    writingInfo: writingType
    synopsis: string
    setSynopsis: React.Dispatch<React.SetStateAction<string>>
    writingDocID: string
    somethingChanged: React.MutableRefObject<boolean>
    disclosure: string
    setDisclosure: React.Dispatch<React.SetStateAction<disclosure>>
    killingVerse: string[]
    setKillingVerse: React.Dispatch<React.SetStateAction<string[]>>
}

const WritingSetting: React.FC<props> = ({
    writingInfo,
    synopsis,
    setSynopsis, 
    writingDocID, 
    somethingChanged, 
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

    return (
            <div className="w-full font-noto flex flex-col items-start px-20 mt-20">
                {/* Synopsis div */}
                <div className="flex flex-col w-2/3">
                    <div className="flex items-center mb-10">
                        <span className="text-2xl font-bold mr-10">시놉시스</span>
                        <button 
                        onClick={()=>{
                            if (writingInfo.synopsis !== synopsis ) {
                                axios.post("http://localhost:3001/updateSynopsis", { genre:writingInfo.genre, writingDocID, synopsis })
                                    .then((res) => {
                                        setAlarm(res.data)
                                        setTimeout(() => {
                                        setAlarm(["", "success", false]);
                                        }, 2000);
                                        somethingChanged.current = !somethingChanged.current
                                })
                            }
                        }}
                        className="border border-blue-400 px-3 py-1 rounded-xl text-[0.75rem] text-blue-400 hover:bg-blue-100">저장</button>
                    </div>
                    <textarea 
                    value={synopsis}
                    onChange={(e)=>{setSynopsis(e.target.value)}} 
                    className="resize-none px-3 py-3 border border-blue-400 w-full rounded-lg h-72 overflow-y-scroll bg-transparent focus:outline-none">
                        {synopsis}
                    </textarea>
                </div>
                
                {/* Killing verse */}
                <div>
                    
                </div>
                {/* Disclosure div */}
                <div className="flex flex-col items-start w-1/3 my-20">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold mr-10">공개 범위</span>
                        <button 
                        onClick={()=>{
                            if (writingInfo.disclosure !== disclosure ) {
                                axios.post("http://localhost:3001/updateDisclosure", { genre:writingInfo.genre, writingDocID, disclosure })
                                    .then((res) => {
                                        setAlarm(res.data)
                                        setTimeout(() => {
                                        setAlarm(["", "success", false]);
                                        }, 2000);
                                        somethingChanged.current = !somethingChanged.current
                                    })
                            }
                        }}
                        className="border border-blue-400 px-3 py-1 rounded-xl text-[0.75rem] text-blue-400 hover:bg-blue-100">저장</button>
                    </div>
                    <div className="w-full flex items-center justify-between mt-5 py-2 px-3">
                        <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "PUBLIC" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("PUBLIC")}}>모두</button>
                        <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "FOLLOWERS" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("FOLLOWERS")}}>팔로워</button>
                        <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "PRIVATE" && "bg-[#f5e1db]"}`} onClick={()=>{setDisclosure("PRIVATE")}}>비공개</button>
                    </div>
                </div>

                {/* Delete */}
                {
                    deleteModalOpen && 
                    <motion.div
                    animate={{
                        backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
                    }}
                    transition={{ duration: 0.2 }}
                    className="fixed w-full h-full z-[10000] items-center justify-center top-0 left-0 flex"
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
                                        axios.post("http://localhost:3001/deleteWriting", {
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
                        <button className={`text-md font-bold border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${disclosure === "PUBLIC" && "bg-[#f5e1db]"}`} onClick={()=>{setDeleteModalOpen(true)}}>삭제 하기</button>
                    </div>
                </div>
            </div>
        )
}

export default WritingSetting