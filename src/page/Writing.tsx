import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import UserContext from "../context/user"
import { getUserByEmail } from "../services/firebase"
import { getFirestoreUser } from "../type"

const Writing = () => {
    const { uid, writingDocID } = useParams()
    const { user: contextUser } = useContext(UserContext)
    const [ userInfo, setUserInfo ] = useState<getFirestoreUser>({} as getFirestoreUser)

    useEffect(() => {
        if (contextUser.email) {
            getUserByEmail(contextUser.email as string).then((res) => {
                setUserInfo(res.data() as getFirestoreUser)
            })
        }
    }, [uid])

    return (
    <div className="relative w-full font-noto bg-gradient-to-b from-[#e4d0ca] to-transparent bg-opacity-30">
        <div className="flex w-full items-center justify-between px-20">
            {/* logo */}
            <img className="h-28" src="/logo/Ollim-logos_transparent.png" alt="header logo" />
            {userInfo.profileImg && 
            <div className="flex items-center">
                <img className="rounded-full w-10" src={userInfo.profileImg} alt="header profile" />
                <span className="font-bold ml-3">{userInfo.username}</span>
            </div>}
        </div> 
    </div>)
}

export default Writing