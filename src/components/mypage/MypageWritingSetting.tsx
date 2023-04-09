import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { memo, useState } from "react"
import { genre } from "../../type"
interface props {
    title: string
    genre: genre
    killingVerse: string[]
    synopsis: string
}
const MypageWritingSetting: React.FC<props> = ({ title, genre, killingVerse, synopsis }) => {
    const gerneType = {
        SCENARIO: "시나리오",
        POEM: "시",
        NOVEL: "소설"
    }
    const [hoverExpandDetail, setHoverExpandDetail] = useState(false)
    const [timer, setTimer] = useState<NodeJS.Timeout>()
    const [infoVisible, setInfoVisible] = useState(false)

    return (
        <motion.div
            layout
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
                    {infoVisible && <span className="absolute bg-gray-800 text-white top-1 right-1 text-xs rounded-lg px-2 py-1">기다려서 세부사항을 확인하기</span>}
                    <div className="mb-3">
                        <span className="text-xl font-black">{title}</span>
                        <span className="text-sm text-gray-700 font-black ml-3">{gerneType[genre]}</span>
                    </div>
                    <textarea value={synopsis} readOnly className="cursor-pointer pointer-event-none text-sm text-gray-400 mb-3 font-semibold resize-none bg-transparent overflow-y-hidden">{synopsis}</textarea>
                </motion.div>
                <AnimatePresence>
                    {hoverExpandDetail && killingVerse &&
                        <motion.div key="container-after" style={{ top: "-76px" }} layoutId="container" className="w-full h-72 absolute left-0 flex flex-col justify-center items-center bg-white border border-logoBrown border-opacity-50 rounded-xl shadow-lg py-5 px-3 z-10">
                            {killingVerse.map((verse, index) => (
                                <motion.span
                                    className="font-bold italic"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.5 }}>
                                    {verse}
                                </motion.span>
                            ))}
                        </motion.div>
                    }
                </AnimatePresence>
            </AnimateSharedLayout>
        </motion.div>
    )
}

export default memo(MypageWritingSetting)