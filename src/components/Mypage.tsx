import { useContext, useEffect, useState } from "react"
import UserContext from "../context/user"
import { getUserByEmail } from "../services/firebase"

const Mypage = () => {
    const { user: contextUser } = useContext(UserContext)
    const [user, setUser] = useState<any>({})

    useEffect(() => {
        getUserByEmail(contextUser.email as string).then((res)=>{setUser(res.data())})
}, [])
    
    return (
        <div className="w-full font-noto">
            <div className="flex items-center justify-between w-full mx-20">
                {/* logo */}
                <img className="h-28" src="logo/Ollim-logos_transparent.png" alt="header logo" />
            </div> 
            { user &&
            <div className="w-full flex">
                {/* Profile div */}
                <div className="w-full flex flex-col items-center justify-between">
                    <img className="rounded-full w-64" src={user.profileImg} alt="profile" />
                    <div className="flex w-full items-center justify-center mt-5">
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-sm">0</span>                            
                            <span className="text-sm">글</span>                            
                        </div>
                        <div className="flex flex-col items-center justify-center mx-5">
                            <span className="text-sm">0</span>                            
                            <span className="text-sm">팔로워</span>                            
                            </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-sm">0</span>                            
                            <span className="text-sm">팔로우</span>                            
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-center mt-5">
                        <button className="mr-5">
                            작품 추가
                        </button>
                        <button>
                            다른 작가의 작품보기
                        </button>
                    </div>
                    
                    <div className="w-2/3 my-10 grid grid-cols-3 gap-4">
                        <div className="border border-black grid grid-cols-7 place-items-center">
                            {new Array(28).fill(0).map(()=>(
                                <div className="text-sm w-1/2 h-3/4 border border-black rounded-lg flex items-center justify-center">
                                    0
                                </div>
                            ))}
                        </div>
                        <div className="border border-black grid grid-cols-7 place-items-center">
                            {new Array(31).fill(0).map(()=>(
                                <div>
                                    0
                                </div>
                            ))}
                        </div>
                        <div className="border border-black grid grid-cols-7 place-items-center">
                            {new Array(30).fill(0).map(()=>(
                                <div>
                                    0
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <span>작성중인 글</span>
                    <div className="grid grid-cols-3">
                        
                    </div>
                    <div>
                        완결된 글
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default Mypage