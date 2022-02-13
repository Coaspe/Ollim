import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { memo, useState } from "react"
import { useNavigate } from "react-router-dom"
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
                <motion.div key="container-before" layoutId="container" className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-3">  
                            {infoVisible && <span className="absolute bg-gray-800 text-white top-1 right-1 text-xs rounded-lg px-2 py-1">기다려서 세부사항을 확인하기</span>}
                            <div  className="mb-3">
                                <span className="text-xl font-black">{data.title}</span>
                                <span className="text-sm text-gray-700 font-black ml-3">{gerneType[data.genre as genre]}</span>
                            </div>
                            <span className="text-sm text-gray-400 mb-3 font-semibold">석주가 담배 오지게 피는 소설입니다.</span>
                            <span className="italic">사람 이름이 엄준식?</span>
                        </motion.div>
                    <AnimatePresence>

                        {hoverExpandDetail &&
                        <motion.div key="container-after" layoutId="container" className="w-full h-72 absolute left-0 -top-[76px] flex flex-col justify-center items-center border border-logoBrown border-opacity-50 rounded-xl shadow-lg py-5 px-3 z-10">
                            <motion.span className="italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} >그가 아직도 살아있다고...? {<br />}</motion.span>
                            <motion.span className="text-red-500 font-bold italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.5}}>엄준식은... 살아있다...!!! {<br />}</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                        </motion.div>}
                    </AnimatePresence>
                </AnimateSharedLayout>
            </motion.div>
    )
}

export default memo(MypageWriting)
