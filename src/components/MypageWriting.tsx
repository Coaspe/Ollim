import { AnimatePresence, motion } from "framer-motion"
import {useState } from "react"

const MypageWriting = () => {
    const [hoverExpandDetail, setHoverExpandDetail] = useState(false)
    const [timer, setTimer] = useState<NodeJS.Timeout>()

    return (
        <motion.div 
            layout
            animate
            onHoverStart={() => {
                setTimer(setTimeout(() => { setHoverExpandDetail(true) }, 1000))
            }} 
            onHoverEnd={() => {
                setHoverExpandDetail(false)
                timer && clearTimeout(timer)
            }} 
            whileHover={{ y: "-10%" }} 
            className="w-1/3 border border-logoBrown border-opacity-50 rounded-xl my-5 shadow-lg cursor-pointer py-5 px-3 flex flex-col">
                <AnimatePresence exitBeforeEnter>
                    {!hoverExpandDetail ? 
                    <>
                        <span className="text-xl font-black mb-3">돗대와 막병</span>
                        <span className="text-sm text-gray-400 mb-3 font-semibold">석주가 담배 오지게 피는 소설입니다.</span>
                        <span className="italic">사람 이름이 엄준식?</span>
                    </>
                    : 
                    <>
                        <motion.span className="italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} >그가 아직도 살아있다고...? {<br />}</motion.span>
                        <motion.span className="text-red-500 font-bold italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.5}}>엄준식은... 살아있다...!!! {<br />}</motion.span>
                        <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴리 없어...없다고!!!</motion.span>
                    </>
                    }
                </AnimatePresence>
            </motion.div>
    )
}

export default MypageWriting
// firestore post
// post name: string
// post description: string
// recent edit date: number
// commit log
