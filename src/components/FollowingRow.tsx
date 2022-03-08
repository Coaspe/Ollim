import { motion } from "framer-motion"
import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { getFirestoreUser } from "../type"

interface props {
    data: getFirestoreUser
    setFollowingsModal: React.Dispatch<React.SetStateAction<boolean>>
}
const FollowingRow: React.FC<props> = ({ data, setFollowingsModal }) => {
    const navigator = useNavigate()
    return (
        <motion.div whileHover={{y: "-10%"}} onClick={() => {
            setFollowingsModal(false)
            navigator(`/${data.uid}`)
        }} className="flex items-center cursor-pointer w-full shadow-lg px-2 py-1 rounded-2xl">
            <img className="w-7 rounded-full" src={data.profileImg} alt="follower" />
            <span className="ml-3">{data.username}</span>
        </motion.div>
    )
}

export default memo(FollowingRow)