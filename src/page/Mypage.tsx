import { AnimatePresence, motion } from "framer-motion"
import { Profiler, useContext, useEffect, useState } from "react"
import MypageWriting from "../components/MypageWriting"
import UserContext from "../context/user"
import { getPoemArrayInfo, getUserWritings, getNovelArrayInfo, getScenarioArrayInfo, getUserByUID } from "../services/firebase"
import Compressor from "compressorjs";
import { signOutAuth } from "../helpers/auth-OAuth2"
import NewWritingModal from "../components/NewWritingModal"
import CustomNodeFlow from "../diagram/RelationShipDiagram"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { alarmType, getFirestoreNovel, getFirestorePoem, getFirestoreScenario, getFirestoreUser, getFirestoreUserWritings } from "../type"
import { alarmAction, userInfoAction } from "../redux"
import { useNavigate, useParams } from "react-router-dom"

import Calendar from "../components/Calendar"
import { Alert } from "@mui/material"
import axios from "axios"

const Mypage = () => {

    // profile owner's uid
    const { uid } = useParams()
    // profile ownser's firestore information
    const [profileOwnerInfo, setProfileOwnerInfo] = useState<getFirestoreUser>({} as getFirestoreUser)
    
    // context user
    const { user: contextUser } = useContext(UserContext)

    const [profileImage, setProfileImage] = useState("")
    const [userWritings, setUserWritings] = useState({} as getFirestoreUserWritings)
    // new Writing modal state
    const [newWritingModalOpen, setNewWritingModalOpen] = useState(false)
    // category state
    const [onWritingCategory, setOnWritingCategory] = useState("TOTAL")
    const [doseUserFollow, setDoseUserFollow] = useState(false)
    // Profile owner's poems list
    const [poems, setPoems] = useState<Array<getFirestorePoem>>([])
    // Profile owner's novels list
    const [novels, setNovels] = useState<Array<getFirestoreNovel>>([])
    // Profile owner's scenarioes list
    const [scenarioes, setScenarioes] = useState<Array<getFirestoreScenario>>([])
    // Profile owner's total writings list
    const [totalWritings, setTotalWritings] = useState<Array<getFirestoreScenario | getFirestoreNovel | getFirestorePoem>>([])
    const dispatch = useDispatch()

    // header context userInfo
    const setUserInfo = (userInfo: getFirestoreUser) => {
        dispatch(userInfoAction.setUserInfo({userInfo}))
    }
    const userInfo = useSelector((state: RootState) => state.setUserInfo.userInfo)
    
    const setAlarm = (alarm: [string ,alarmType, boolean]) => {
        dispatch(alarmAction.setAlarm({alarm}))
    }

    const navigator = useNavigate()

    useEffect(() => {
        if (uid) {
            getUserByUID(uid as string).then((res: any) => {
                const data = res.docs[0].data();
                
                setProfileOwnerInfo(data)
                setProfileImage(data.profileImg)
                getUserWritings(data.uid).then((writings) => {setUserWritings(writings as getFirestoreUserWritings)})
            })
        } else {
            getUserByUID(contextUser.uid).then((res: any) => {
                const data = res.docs[0].data();
                
                setProfileOwnerInfo(data)
                getUserWritings(data.uid).then((writings) => {setUserWritings(writings as getFirestoreUserWritings)})
                setProfileImage(data.profileImg)
            })
        }

        // get context user's information
        getUserByUID(contextUser.uid).then((res: any) => {
            const data = res.docs[0].data()
            setUserInfo(data)
            setDoseUserFollow(data.followings.includes(uid))
        })
    }, [uid])

    useEffect(() => {
        // get Writings informations from firestore
        const getWritings = async () => {
            const poems = await getPoemArrayInfo(userWritings.poemDocID)
            const novel = await getNovelArrayInfo(userWritings.novelDocID)
            const scenario = await getScenarioArrayInfo(userWritings.scenarioDocID)

            setPoems((poems as Array<getFirestorePoem>).sort((a, b) => (b.dateCreated - a.dateCreated)))
            setNovels((novel as Array<getFirestoreNovel>).sort((a, b) => (b.dateCreated - a.dateCreated)))
            setScenarioes((scenario as Array<getFirestoreScenario>).sort((a, b) => (b.dateCreated - a.dateCreated)))
            setTotalWritings(Array.prototype.concat(poems, novel, scenario).sort((a, b) => (b.dateCreated - a.dateCreated)))
        }
        if (Object.keys(userWritings).length !== 0) {
            getWritings()
        }
    }, [userWritings])

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
                const url = URL.createObjectURL(result)

                const formData = new FormData()
                formData.append("userUID", profileOwnerInfo.uid)
                formData.append("userEmail", profileOwnerInfo.userEmail)
                formData.append('file', result)

                axios.post(`https://ollim.herokuapp.com/updateProfileImage`, formData)
                    .then((res) => {
                        setAlarm(res.data)
                        setTimeout(()=>{setAlarm(["", "success", false])}, 3000)
                    })
                setProfileImage(url)
            },
            error(err) {
                console.log(err.message);
                return;
            },
        });
    };
    const logTimes = (id:any, phase:any, actualTime:any, baseTime:any, startTime:any, commitTime:any) => {
    // console.log(`${id}'s ${phase} phase:`);
    // console.log(`Actual time: ${actualTime}`);
    //   console.log(`Base time: ${baseTime}`);
    //   console.log(`Start time: ${startTime}`);
    //   console.log(`Commit time: ${commitTime}`);
    };
    const alarm = useSelector((state: RootState) => state.setAlarm.alarm)
    const alertVariants = {
        initial: {
            opacity: 0,
            y:-10
        },
        animate: {
            opacity: 1,
            y:0
        },
        exit: {
            opacity: 0,
            y:-10
        }
    }

    return (
        <>
        <AnimatePresence>
            {
                alarm[2] &&
                <motion.div
                variants={alertVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{zIndex: 2000}}
                className="fixed w-1/2 top-5 translate-x-1/2 left-1/4">
                    <Alert severity={alarm[1]}>{alarm[0]}</Alert>
                </motion.div>
            }
        </AnimatePresence>
        
        {profileOwnerInfo && profileImage  && userWritings && totalWritings ?
            <div className="relative w-full font-noto bg-opacity-30">
                {/* New Writing Modal */}
                {newWritingModalOpen && <NewWritingModal setNewWritingModalOpen={setNewWritingModalOpen}/>}
                <div className="flex w-full items-center justify-between px-20">
                    {/* logo */}
                    <img className="h-28" src="logo/Ollim-logos_transparent.png" alt="header logo" />
                    {userInfo ?
                    <div onClick={()=>{
                        navigator(`/${userInfo.uid}`)
                    }} className="flex items-center cursor-pointer">
                        <img src={userInfo.profileImg} className="w-7 mr-3 rounded-full" alt="user profile" />
                        <span>{userInfo.username}</span>
                    </div>
                    : 
                    <div>
                        <svg
                            className="w-7 rounded-full"
                            x="0px" y="0px"
                            viewBox="0 0 481.5 481.5">
                        <g>
                            <g>
                                <path d="M0,240.7c0,7.5,6,13.5,13.5,13.5h326.1l-69.9,69.9c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l93-93
                                    c5.3-5.3,5.3-13.8,0-19.1l-93-93c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l69.9,69.9h-326C6,227.2,0,233.2,0,240.7z"/>
                                <path d="M382.4,0H99C44.4,0,0,44.4,0,99v58.2c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V99c0-39.7,32.3-72,72-72h283.5
                                    c39.7,0,72,32.3,72,72v283.5c0,39.7-32.3,72-72,72H99c-39.7,0-72-32.3-72-72V325c0-7.5-6-13.5-13.5-13.5S0,317.5,0,325v57.5
                                    c0,54.6,44.4,99,99,99h283.5c54.6,0,99-44.4,99-99V99C481.4,44.4,437,0,382.4,0z"/>
                            </g>
                        </g>
                        </svg>

                    </div>
                    }
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
                            <span className="text-2xl font-bold my-7 mr-3">{profileOwnerInfo.username}</span>
                            {uid && contextUser.uid !== uid && 
                                <button onClick={() => {
                                    setDoseUserFollow((origin) => {
                                        axios.post(`https://ollim.herokuapp.com/updateFollowing`, {
                                            followingUserEmail: userInfo.userEmail,
                                            followingUserUID: userInfo.uid,
                                            followedUserEmail: profileOwnerInfo.userEmail,
                                            followedUserUID: profileOwnerInfo.uid,
                                            followingState: doseUserFollow
                                        }).then((res) => {
                                        })
                                        return !origin
                                    })
                                }
                                } className={`${doseUserFollow ? "bg-blue-400" : "bg-gray-300"} px-2 py-1 rounded-xl text-xs font-Nanum_Gothic font-bold text-gray-700`}>팔로우</button>
                            }
                            {(!uid || contextUser.uid === uid) && 
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
                            </svg>}
                        </div>
                        
                        {/* Posts, Followers, Followings */}
                        {
                        <div className="flex w-full items-center justify-center text-sm">
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-bold text-gray-400 font-Nanum_Gothic">{totalWritings.length}</span>                            
                                <span className="">글</span>                            
                            </div>
                            <div className="flex flex-col items-center justify-center mx-5">
                                    <span className="font-bold text-gray-400 font-Nanum_Gothic">{profileOwnerInfo.followers.length}</span>                            
                                <span className="">팔로워</span>                            
                                </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-bold text-gray-400 font-Nanum_Gothic">{profileOwnerInfo.followings.length}</span>                           
                                <span className="">팔로우</span>                            
                            </div>
                        </div>}
                        <div className="flex w-full items-center justify-center my-10">
                            <motion.button onClick={()=>{setNewWritingModalOpen(true)}} whileHover={{ y: "-10%" }} className="mr-5 px-4 py-3 rounded-2xl bg-white shadow-md font-semibold">
                                새 작품 추가
                            </motion.button>
                            <motion.button whileHover={{ y:"-10%" }} className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold">
                                다른 작가의 작품보기
                            </motion.button>
                        </div>

                        {/* Calendar */}
                        <Profiler id="calendar" onRender={logTimes}>
                            <Calendar totalCommits={userWritings.totalCommits}/>
                        </Profiler>

                        {/* On writing, Done */}
                        <div className="flex items-center flex-col mt-20 w-2/3">
                            <div className="w-full grid grid-cols-3 items-center mb-20">
                                <span className="text-2xl font-bold justify-center col-start-2 w-full text-center">작성중인 글</span>
                                <div className="grid grid-cols-4 col-start-3 gap-4 text-sm">
                                    <button className={`rounded-xl hover:bg-gray-300 py-1 ${onWritingCategory === "NOVEL" && "bg-gray-400"}`} onClick={()=>{setOnWritingCategory("NOVEL")}}>소설</button>
                                    <button className={`rounded-xl hover:bg-gray-300 py-1 ${onWritingCategory === "POEM" && "bg-gray-400"}`} onClick={()=>{setOnWritingCategory("POEM")}}>시</button>
                                    <button className={`rounded-xl hover:bg-gray-300 py-1 ${onWritingCategory === "SCENARIO" && "bg-gray-400"}`} onClick={()=>{setOnWritingCategory("SCENARIO")}}>시나리오</button>
                                    <button className={`rounded-xl hover:bg-gray-300 py-1 ${onWritingCategory === "TOTAL" && "bg-gray-400"}`} onClick={()=>{setOnWritingCategory("TOTAL")}}>전체</button>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 items-center justify-between w-full gap-5">
                                {onWritingCategory === "NOVEL" && novels.map((data) => (<MypageWriting key={data.dateCreated} data={data} />))}
                                {onWritingCategory === "POEM" && poems.map((data) => (<MypageWriting key={data.dateCreated} data={data} />))}
                                {onWritingCategory === "SCENARIO" && scenarioes.map((data) => (<MypageWriting key={data.dateCreated} data={data} />))}
                                {onWritingCategory === "TOTAL" && totalWritings.map((data) => (<MypageWriting key={data.dateCreated} data={data} />))}
                            </div>
                        </div>
                        <motion.div layout className="flex items-center flex-col my-20 w-2/3">
                            <div className="w-full grid grid-cols-3 items-center mb-20">
                                <span className="text-2xl font-bold justify-center col-start-2 w-full text-center">완결된 글</span>
                            </div>
                            <motion.div className="grid grid-cols-3 items-center justify-between w-full gap-5">
                                {totalWritings.filter((data)=>(data.done === true)).map((data)=>(<MypageWriting key={data.dateCreated} data={data} />))}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
                
                <div className="w-full h-1/3">
                    <CustomNodeFlow />
                </div>
            </div>
            :
            <div className="w-screen h-screen flex items-center justify-center bg-opacity-30">
                <img src="/logo/Ollim-logos_black.png" className="w-32 opacity-50" alt="loading" />
            </div>
            }
        </>
    )
}

export default Mypage