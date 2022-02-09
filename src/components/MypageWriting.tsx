import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import {useEffect, useRef, useState } from "react"
interface props {
    type: string
}
const MypageWriting:React.FC<props> = ({type}) => {
    const [hoverExpandDetail, setHoverExpandDetail] = useState(false)
    const [timer, setTimer] = useState<NodeJS.Timeout>()
    const divRef = useRef<HTMLDivElement>(null)
    useEffect(() => {

        divRef.current && console.log(divRef.current.clientHeight);
    }, [divRef])
    const divVariants = {
        exit: {
            opacity: [1, 0],
            transition: {
                duration: 0.1
            }
        }
    }
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
            className="relative w-full h-full">
                <AnimateSharedLayout>
                    <AnimatePresence>
                        {!hoverExpandDetail ? 
                        <motion.div key="container-before" layoutId="container" className="w-full h-full flex flex-col border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-3">  
                            <motion.div variants={divVariants} exit="exit" className="mb-3">
                                <span className="text-xl font-black">돗대와 막병</span>
                                <span className="text-sm text-gray-700 font-black ml-3">소설</span>
                            </motion.div>
                            <motion.span variants={divVariants} exit="exit" className="text-sm text-gray-400 mb-3 font-semibold">석주가 담배 오지게 피는 소설입니다.</motion.span>
                            <motion.span variants={divVariants} exit="exit" className="italic">사람 이름이 엄준식?</motion.span>
                        </motion.div>
                        :
                        <motion.div key="container-after" layoutId="container" className="w-full h-72 absolute left-0 -top-[76px] flex flex-col justify-center items-center border border-logoBrown border-opacity-50 rounded-xl shadow-lg py-5 px-3 z-10">
                            <motion.span className="italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} >그가 아직도 살아있다고...? {<br />}</motion.span>
                            <motion.span className="text-red-500 font-bold italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 0.5}}>엄준식은... 살아있다...!!! {<br />}</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                            <motion.span className="italic"initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{delay: 1}}>그럴 리 없어...없다고!!!</motion.span>
                        </motion.div>
                        }
                    </AnimatePresence>
                </AnimateSharedLayout>
            </motion.div>
    )
}

export default MypageWriting
