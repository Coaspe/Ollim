import { Tooltip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccountWithEmailAndPassword } from "../helpers/auth-email";
import { signInWithGoogle } from "../helpers/auth-OAuth2";
import { leftPartType } from "../type";

const Intro = () => {
  const [leftPart, setLeftPart] = useState<leftPartType>("INTRO");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigator = useNavigate();
  const divVariants = {
    initial: {
      y: "30%",
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.9,
      },
    },
  };
  const pVariants = {
    initial: {
      y: "50%",
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };
  const pVariants2 = {
    initial: {
      y: "40%",
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.6,
      },
    },
  };
  return (
    <motion.div className="flex flex-col h-screen w-screen font-noto">
      <div className="z-10 w-full h-20 flex items-center justify-between GalaxyS20Ultra:h-0">
        <div className="flex items-center justify-between w-full mx-20">
          {/* logo */}
          <img
            className="h-28 GalaxyS20Ultra:hidden GalaxyS20Ultra:h-0"
            src="logo/Ollim-logos_transparent.png"
            alt="header logo"
          />
        </div>
      </div>
      <div className="w-1/2 h-full flex z-10 items-center justify-center GalaxyS20Ultra:w-full GalaxyS20Ultra:px-10">
        <AnimatePresence exitBeforeEnter>
          {leftPart === "INTRO" ? (
            <motion.div
              key="Greeting"
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col z-10 items-center GalaxyS20Ultra:h-full GalaxyS20Ultra:space-y-10 GalaxyS20Ultra:justify-center"
            >
              <motion.p
                variants={pVariants}
                initial="initial"
                animate="animate"
                className="w-1/2 text-3xl whitespace-pre-line mb-10 GalaxyS20Ultra:w-full GalaxyS20Ultra:mb-0"
              >
                안녕하세요! {`\n`} 우리는{" "}
                <span className="text-4xl text-logoBrown font-extrabold">
                  올림
                </span>{" "}
                입니다
              </motion.p>

              <motion.p
                variants={pVariants2}
                initial="initial"
                animate="animate"
                className="w-1/2 text-lg  GalaxyS20Ultra:w-full"
              >
                작가님의 포트폴리오를 관리하고, 다른 작가들의 글을 열람하세요!
              </motion.p>
              <motion.div
                variants={divVariants}
                initial="initial"
                animate="animate"
                className="w-1/2 flex items-center justify-center mt-7 text-sm  GalaxyS20Ultra:w-full"
              >
                <motion.button
                  whileHover={{ y: "-10%" }}
                  className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold mr-5"
                  onClick={() => {
                    setLeftPart("LOGIN");
                  }}
                >
                  로그인
                </motion.button>
                <motion.button
                  style={{ backgroundColor: "#c69e92" }}
                  onClick={() => {
                    navigator("/community");
                  }}
                  whileHover={{ y: "-10%" }}
                  className="px-5 py-3 rounded-2xl shadow-md font-semibold"
                >
                  다른 작가들의 글
                </motion.button>
              </motion.div>
            </motion.div>
          ) : leftPart === "LOGIN" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="Login"
              className="w-full flex flex-col z-10 items-center"
            >
              <motion.p className="w-1/2 text-3xl whitespace-pre-line mb-10 font-bold text-center ">
                로그인
              </motion.p>
              <motion.div className="flex flex-col">
                <input
                  className="border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md mb-3 shadow-md"
                  type="email"
                  placeholder="이메일"
                />
                <input
                  className="border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md shadow-md"
                  type="password"
                  placeholder="비밀번호"
                />
              </motion.div>
              <div className="flex w-1/2 items-center justify-center mt-10 mb-3">
                <hr className="w-1/4 border-gray-400" />
                <span className="text-sm text-gray-400 mx-2">또는</span>
                <hr className="w-1/4 border-gray-400" />
              </div>
              <div className="flex w-1/2 items-center justify-center mb-10">
                <Tooltip placement="top" title="구글 아이디로 로그인" arrow>
                  <motion.img
                    onClick={() => {
                      signInWithGoogle(navigator);
                    }}
                    whileHover={{ y: "-10%" }}
                    className="w-7 cursor-pointer"
                    src="/imageEct/googlecircle.png"
                    alt="google login"
                  />
                </Tooltip>
              </div>
              <motion.div className="w-1/2 flex items-center justify-center text-sm space-x-3">
                <motion.span
                  onClick={() => {
                    setLeftPart("INTRO");
                  }}
                  whileHover={{ y: "-10%" }}
                  className="px-3 py-3 rounded-full bg-white shadow-md font-semibold cursor-pointer"
                >
                  뒤로
                </motion.span>
                <motion.button
                  onClick={() => {
                    setLeftPart("SIGNUP");
                  }}
                  whileHover={{ y: "-10%" }}
                  className="px-3 py-3 rounded-full bg-white shadow-md font-semibold"
                >
                  가입
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="SIGNUP"
              className="w-full flex flex-col z-10 items-center"
            >
              <motion.p className="w-1/2 text-3xl whitespace-pre-line mb-10 font-bold text-center ">
                가입
              </motion.p>
              <motion.div className="flex flex-col">
                <input
                  className="border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md mb-3 shadow-md"
                  type="email"
                  onChange={(e) => {
                    setSignupEmail(e.target.value);
                  }}
                  placeholder="이메일"
                />
                <input
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                  }}
                  className="border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md shadow-md"
                  type="password"
                  placeholder="비밀번호"
                />
              </motion.div>

              <motion.div className="w-1/2 mt-10 flex items-center justify-center text-sm space-x-3">
                <motion.span
                  onClick={() => {
                    setLeftPart("INTRO");
                  }}
                  whileHover={{ y: "-10%" }}
                  className="px-3 py-3 rounded-full bg-white shadow-md font-semibold cursor-pointer"
                >
                  처음
                </motion.span>
                <motion.button
                  onClick={() => {
                    setLeftPart("LOGIN");
                  }}
                  whileHover={{ y: "-10%" }}
                  className="px-3 py-3 rounded-full bg-white shadow-md font-semibold"
                >
                  로그인
                </motion.button>
                <motion.button
                  onClick={() => {
                    createAccountWithEmailAndPassword(
                      signupEmail,
                      signupPassword,
                      navigator
                    );
                  }}
                  whileHover={{ y: "-10%" }}
                  className="px-3 py-3 rounded-full bg-white shadow-md font-semibold"
                >
                  확인
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="-z-0 absolute top-0 left-0 w-full h-full opacity-80 GalaxyS20Ultra:invisible">
        <img
          className="w-full h-full"
          src="backgroundImage/main.jpg"
          alt="background"
        />
      </div>

      <div className="GalaxyS20Ultra:visible GalaxyS20Ultra:w-full GalaxyS20Ultra:h-full GalaxyS20Ultra:absolute GalaxyS20Ultra:bg-genreSelectedBG"></div>
    </motion.div>
  );
};

export default Intro;
