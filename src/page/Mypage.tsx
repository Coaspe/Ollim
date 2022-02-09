import { motion } from "framer-motion"
import { useContext, useEffect, useState } from "react"
import MypageWriting from "../components/MypageWriting"
import UserContext from "../context/user"
import { getUserByEmail } from "../services/firebase"
import Compressor from "compressorjs";
import { signOutAuth } from "../helpers/auth-OAuth2"
import NewWritingModal from "../components/NewWritingModal"
import CustomNodeFlow from "../diagram/RelationShipDiagram"

const Mypage = () => {
    const { user: contextUser } = useContext(UserContext)
    const [user, setUser] = useState<any>({})
    const [profileImage, setProfileImage] = useState("")
    const [newWritingModalOpen, setNewWritingModalOpen] = useState(false)
    const [text, setText] = useState("")

    useEffect(() => {
        getUserByEmail(contextUser.email as string).then((res: any) => {
            setUser(res.data())
            setProfileImage(res.data().profileImg)
        })
    }, [])

    const handleFileOnChange = (event: any) => {
        const element = event.target.files[0]
        
        let qual = 0.45;

        if (element.size >= 4000000) {
            qual = 0.1
        } else if (element.size >= 2000000) {
            qual = 0.2
        } else if (element.size >= 1000000) {
            qual = 0.4
        }

        new Compressor(element, {
            quality: qual,
            width: 800,
            height: 800,
            success(result: any) {
                // setFile(result)
                const url = URL.createObjectURL(result)
                // Get Photo's average color for space
                setProfileImage(url)
            },
            error(err) {
                console.log(err.message);
                return;
            },
        });
    };

    return (
        <>
        {user && profileImage ?
            <div className="relative w-full font-noto bg-gradient-to-b from-[#e4d0ca] to-transparent bg-opacity-30">
                {newWritingModalOpen && <NewWritingModal setNewWritingModalOpen={setNewWritingModalOpen}/>}
                <div className="flex w-full items-center justify-between px-20">
                    {/* logo */}
                    <img className="h-28" src="logo/Ollim-logos_transparent.png" alt="header logo" />
                </div> 
                <div className="w-full flex">
                    
                    {/* Profile div */}
                    <div className="w-full flex flex-col items-center justify-between">
                        
                        {/* Profile Image */}
                        <div className="relative">
                            {/* Profile Image Edit */}
                            <label htmlFor="profileImg" >
                                <div className="opacity-0 absolute flex items-center justify-center rounded-full w-full h-full cursor-pointer hover:opacity-20 hover:bg-black" />
                                <img className="rounded-full w-64 shadow-xl" src={profileImage} alt="profile" />
                            </label>
                            <input onChange={handleFileOnChange} style={{ display: "none" }} type="file" name="profileImg" id="profileImg"/>
                        </div>
                        
                        {/* Username */}
                        <div className="flex items-center justify-center">
                            <span className="text-2xl font-bold my-7 mr-3">{user.username}</span>
                            <svg
                            onClick={signOutAuth}
                            className="w-7 cursor-pointer"
                            x="0px" y="0px"
                            viewBox="0 0 490.3 490.3">
                                <g>
                                    <g>
                                        <path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3
                                            s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6
                                            c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1
                                            C27.9,58.95,0,86.75,0,121.05z"/>
                                        <path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9
                                            c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63
                                            C380.6,325.15,380.6,332.95,385.4,337.65z"/>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        
                        {/* Posts, Followers, Followings */}
                        <div className="flex w-full items-center justify-center">
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-black ">0</span>                            
                                <span className="text-sm ">글</span>                            
                            </div>
                            <div className="flex flex-col items-center justify-center mx-5">
                                <span className="font-black">0</span>                            
                                <span className="text-sm">팔로워</span>                            
                                </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-black">0</span>                           
                                <span className="text-sm">팔로우</span>                            
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-center mt-10">
                            {/* <motion.button whileHover={{ y:"-10%" }} className="mr-5 px-4 py-3 rounded-2xl bg-white shadow-md font-semibold">
                                작품 추가
                            </motion.button> */}
                            <motion.button onClick={()=>{setNewWritingModalOpen(true)}} whileHover={{ y:"-10%" }} className="mr-5 px-4 py-3 rounded-2xl bg-white shadow-md font-semibold">
                                새 작품 쓰기
                            </motion.button>
                            <motion.button whileHover={{ y:"-10%" }} className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold">
                                다른 작가의 작품보기
                            </motion.button>
                        </div>
                        <div className="w-2/3 my-10 grid grid-cols-3 gap-4">
                            {/* <div className="border border-black grid grid-cols-7 place-items-center">
                                {new Array(28).fill(0).map((data)=>(
                                    <div key={`${data}1`} className="text-sm w-5 h-5 border border-black rounded-lg flex items-center justify-center">
                                        
                                    </div>
                                ))}
                            </div> */}
                            {/* <div className="border border-black grid grid-cols-7 place-items-center">
                                {new Array(31).fill(0).map((data)=>(
                                    <div key={`${data}2f`} >
                                        0
                                    </div>
                                ))}
                            </div>
                            <div className="border border-black grid grid-cols-7 place-items-center">
                                {new Array(30).fill(0).map((data)=>(
                                    <div key={`${data}3a`} >
                                        0
                                    </div>
                                ))}
                            </div> */}
                        </div>
                        <div className="flex items-center flex-col mt-20 w-2/3">
                            <span className="text-2xl font-extrabold mb-20 z-0">작성중인 글</span>
                            <div className="grid grid-cols-3 items-center justify-between w-full gap-5">
                                <MypageWriting key="1" type="novel"/>
                                <MypageWriting key="2" type="novel"/>
                                <MypageWriting key="3" type="novel"/>
                            </div>
                        </div>
                        <div className="flex items-center flex-col mt-20 w-2/3">
                            <span className="text-2xl font-extrabold mb-20">완결된 글</span>
                            <motion.div layout className="flex items-center justify-between w-full gap-5">
                                <MypageWriting key="1" type="novel"/>
                                <MypageWriting key="2" type="novel"/>
                                <MypageWriting key="3" type="novel"/>
                            </motion.div>
                        </div>
                    </div>
                </div>
                    {/* <Editor text={text} setText={setText}  /> */}
                    <div className="w-full h-1/3">
                <CustomNodeFlow />

                    </div>
            </div>
            :
            <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-[#e4d0ca] to-transparent bg-opacity-30">
                <img src="/logo/Ollim-logos_black.png" className="w-32 opacity-50" alt="loading" />
            </div>
            }
        </>
    )
}

export default Mypage