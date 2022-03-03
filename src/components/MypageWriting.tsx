import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { memo, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../context/user"
import { genre, getFirestoreNovel, getFirestorePoem, getFirestoreScenario } from "../type"
interface props {
    data: getFirestoreNovel | getFirestorePoem | getFirestoreScenario
}
const MypageWriting: React.FC<props> = ({ data }) => {
    const gerneType = {
        SCENARIO: "시나리오",
        POEM: "시",
        NOVEL: "소설"
    }
    const [hoverExpandDetail, setHoverExpandDetail] = useState(false)
    const [timer, setTimer] = useState<NodeJS.Timeout>()
    const [infoVisible, setInfoVisible] = useState(false)
    const {user: contextUser} = useContext(UserContext) 
    const navigator = useNavigate()
    
    return (
        <motion.div 
            layout
            onClick={()=>{navigator(`/writings/${data.userUID}/${data.genre}/${data.id}`)}}            
            onHoverStart={() => {
                setTimer(setTimeout(() => { setHoverExpandDetail(true) }, 1000))
                setInfoVisible(true)
            }} 
            onHoverEnd={() => {
                setHoverExpandDetail(false)
                setInfoVisible(false)
                timer && clearTimeout(timer)
            }} 
            className="relative w-full h-full">
                <AnimateSharedLayout>
                    <motion.div key="container-before" layoutId="container" className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-3 z-0">  
                            {infoVisible && <span className="absolute bg-gray-800 text-white top-1 right-1 text-xs rounded-lg px-2 py-1 font-Nanum_Gothic">기다려서 세부사항을 확인하기</span>}
                            <div  className="mb-3">
                                <span className="text-xl font-black">{data.title}</span>
                                <span className="text-sm text-gray-700 font-black ml-3">{gerneType[data.genre as genre]}</span>
                            </div>
                            <motion.textarea layoutId="textarea" value={data.synopsis} readOnly className="text-sm text-gray-400 mb-3 font-semibold bg-transparent resize-none overflow-hidden pointer-events-none">{data.synopsis}</motion.textarea>
                        </motion.div>
                    <AnimatePresence>
                        {hoverExpandDetail && data.killingVerse &&
                        <motion.div key="container-after" layoutId="container" className="w-full h-72 absolute left-0 -top-[76px] flex flex-col justify-center items-center bg-white border border-logoBrown border-opacity-50 rounded-xl shadow-lg py-5 px-3 cursor-pointer z-10">
                            {data.killingVerse.length !== 0 ?
                                <div className="flex flex-col items-center">
                                    {data.killingVerse.map((verse: string, index) => (
                                        <motion.span
                                            className="font-bold italic"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.5 }}>
                                            {verse}
                                        </motion.span>
                                    ))}
                                <span className="absolute top-[5%] right-[5%] text-xs font-Nanum_Gothic rounded-lg bg-gray-800 text-white px-2 py-1">클릭해서 열람하기</span>
                                </div> :
                                <motion.textarea layoutId="textarea" value={data.synopsis} readOnly className="px-3 py-2 text-sm text-gray-400 mb-3 overflow-y-scroll font-semibold bg-transparent resize-none z-[1000] h-full w-full cursor-pointer focus:outline-none">{data.synopsis}</motion.textarea>
                            }
                        </motion.div>
                    }
                    </AnimatePresence>
                </AnimateSharedLayout>
            </motion.div>
    )
}

export default memo(MypageWriting)
