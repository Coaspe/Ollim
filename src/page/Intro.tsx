import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithGoogle } from "../helpers/auth-OAuth2"

const Intro = () => {
    const [leftPart, setLeftPart] = useState("INTRO")

    const pVariants = {
    initial: {
      y: "50%",
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3
      }
    }
    }
    const pVariants2 = {
        initial: {
        y: "40%",
        opacity: 0
        },
        animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeOut",
            delay: 0.6
        }
        }
    }
    const divVariants = {
        initial: {
        y: "30%",
        opacity: 0
        },
        animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.7,
            ease: "easeOut",
            delay: 0.9
        }
        }
    }
    const navigator = useNavigate()
    return (
        <div className="flex flex-col h-screen w-screen font-noto">
            <div className="z-10 w-full h-20 flex items-center justify-between ">
                <div className="flex items-center justify-between w-full mx-20">
                    {/* logo */}
                    <img className="h-28" src="logo/Ollim-logos_transparent.png" alt="header logo" />
                </div>
            </div>
        <div className="w-1/2 h-full flex z-10 items-center jutify-center">
            <AnimatePresence exitBeforeEnter>
                {leftPart === "INTRO" ?
                    <motion.div key="Intro" animate={{opacity:1}} exit={{opacity:0}} className="w-full flex flex-col z-10 items-center">
                        <motion.p
                            variants={pVariants}
                            initial="initial"
                            animate="animate"
                            className="w-1/2 text-3xl whitespace-pre-line mb-10 font-black">
                            안녕하세요! {`\n`} 우리는 <span className="text-4xl text-logoBrown font-black">올림</span> 입니다
                        </motion.p>
                        
                        <motion.p
                            variants={pVariants2}
                            initial="initial"
                            animate="animate"
                            className="w-1/2 text-lg font-extrabold">작가님의 포트폴리오를 관리하고, 다른 작가들의 글을 열람하세요!</motion.p>
                        <motion.div
                            variants={divVariants}
                            initial="initial"
                            animate="animate"
                            className="w-1/2 flex items-center justify-center mt-7 text-sm">
                            <motion.button
                                whileHover={{ y: "-10%" }}
                                className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold mr-5"
                                onClick={()=>{setLeftPart("LOGIN")}}
                                >
                            로그인
                            </motion.button>
                            <motion.button
                                onClick={()=>{navigator("/community")}}
                                whileHover={{ y: "-10%" }}
                                className="px-5 py-3 rounded-2xl bg-[#c69e92] shadow-md font-semibold">
                            다른 작가들의 글
                            </motion.button>
                        </motion.div>
                    </motion.div>
                    :
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="login" className="w-full flex flex-col z-10 items-center">
                        <motion.p
                            className="w-1/2 text-3xl whitespace-pre-line mb-10 font-black text-center ">
                            로그인
                        </motion.p>
                        <motion.div className="flex flex-col">
                            <input className="border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md mb-3" type="email" placeholder="이메일" />
                            <input className="border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md" type="password" placeholder="비밀번호" />
                        </motion.div>
                        <div className="flex w-1/2 items-center justify-center mt-10 mb-3">
                            <hr className="w-1/4 border-gray-400" />
                            <span className="text-sm text-gray-400 mx-2">또는</span>
                            <hr className="w-1/4 border-gray-400" />
                        </div>
                        <div className="flex w-1/2 items-center justify-center mb-10">
                            <motion.img onClick={()=>{signInWithGoogle(navigator)}} whileHover={{ y: "-10%" }} className="w-7 cursor-pointer" src="/imageEct/googlecircle.png" alt="google login" />
                        </div>
                        <motion.div
                            className="w-1/2 flex items-center justify-center text-sm">
                            <motion.button
                                whileHover={{ y: "-10%" }}
                                className="px-4 py-3 mr-5 rounded-2xl bg-white shadow-md font-semibold"
                                onClick={()=>{setLeftPart("INTRO")}}
                                >
                            뒤로가기
                            </motion.button>
                            <motion.button
                                whileHover={{ y: "-10%" }}
                                className="px-5 py-3 rounded-2xl bg-white shadow-md font-semibold">
                            회원가입
                            </motion.button>
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </div>


        <div className="-z-0 absolute top-0 left-0 w-full h-full opacity-80">
            <img className="w-full h-full" src="backgroundImage/main.jpg" alt="background" />
        </div>
    </div>
    )
}

export default Intro