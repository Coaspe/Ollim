import { Alert, Tooltip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  alertVariants,
  divVariants,
  pVariants,
  pVariants2,
} from "../components/constants/variants";
import {
  createAccountWithEmailAndPassword,
  loginWithEmailAndPassword,
  verifyEmail,
} from "../helpers/auth-email";
import { signInWithGoogle } from "../helpers/auth-OAuth2";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import useProfileData from "../hooks/useVerification";
import { alarmAction } from "../redux";
import { RootState } from "../redux/store";
import { doesEmailExist } from "../services/firebase";
import { alarmType, leftPartType } from "../type";

const Intro = () => {
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const verificatedEmail = useProfileData();
  const [leftPart, setLeftPart] = useState<leftPartType>(
    verificatedEmail ? "SIGNUP" : "INTRO"
  );
  const [signupEmail, setSignupEmail] = useState(verificatedEmail);
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const alarm = useAppSelector((state: RootState) => state.setAlarm.alarm);
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };
  useEffect(() => {
    setSignupEmail(verificatedEmail);
  }, [verificatedEmail]);
  const handleInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(e.target.value);
  };
  return (
    <>
      {/* Alarm */}
      <AnimatePresence>
        {alarm[2] && (
          <motion.div
            variants={alertVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ zIndex: 2000 }}
            className="fixed w-1/2 top-5 translate-x-1/2 left-1/4"
          >
            <Alert severity={alarm[1]}>{alarm[0]}</Alert>
          </motion.div>
        )}
      </AnimatePresence>
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
        <div className="w-4/5 h-full flex z-10 items-center justify-center GalaxyS20Ultra:w-full GalaxyS20Ultra:px-10">
          <AnimatePresence exitBeforeEnter>
            {leftPart === "INTRO" ? (
              <motion.div
                key="Greeting"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-1/2 h-full justify-center flex flex-col z-10 items-center GalaxyS20Ultra:h-full GalaxyS20Ultra:space-y-10 GalaxyS20Ultra:justify-center"
              >
                <motion.p
                  variants={pVariants}
                  initial="initial"
                  animate="animate"
                  className="text-slate-200 w-1/2 text-3xl whitespace-pre-line mb-10 GalaxyS20Ultra:w-full GalaxyS20Ultra:mb-0"
                >
                  안녕하세요! {`\n`} 우리는{" "}
                  <span className="text-4xl text-hoverSpanMenu font-extrabold">
                    올림
                  </span>{" "}
                  입니다
                </motion.p>

                <motion.p
                  variants={pVariants2}
                  initial="initial"
                  animate="animate"
                  className="w-1/2 text-lg GalaxyS20Ultra:w-full text-slate-200"
                >
                  작가님의 포트폴리오를 관리하고, 다른 작가들의 글을 열람하세요!
                </motion.p>

                <motion.div
                  variants={divVariants}
                  initial="initial"
                  animate="animate"
                  className="flex w-1/2 mt-7 text-sm GalaxyS20Ultra:w-full"
                >
                  <motion.img
                    whileHover={{ y: "-10%" }}
                    className="px-2 py-2 w-12 rounded-full bg-white shadow-md font-semibold"
                    onClick={() => {
                      setLeftPart("LOGIN");
                    }}
                    src="/icon/login.png"
                  />
                  <motion.img
                    style={{ backgroundColor: "#c69e92" }}
                    onClick={() => {
                      navigator("/community");
                    }}
                    whileHover={{ y: "-10%" }}
                    className="px-2 py-2 w-12 rounded-full shadow-md font-semibold mx-5"
                    src="/icon/browse.png"
                  />
                  <motion.div
                    initial="initial"
                    animate="animate"
                    variants={divVariants}
                  >
                    <motion.button
                      whileHover={{ y: "-10%" }}
                      className="px-4 py-3 rounded-2xl bg-white shadow-md font-semibold"
                      onClick={() => {
                        loginWithEmailAndPassword(
                          "achoe628@naver.com",
                          "test111"
                        );
                      }}
                    >
                      테스트 계정
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : leftPart === "LOGIN" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="Login"
                className="w-1/3 flex flex-col z-10 items-center"
              >
                <motion.p className="w-1/2 text-3xl whitespace-pre-line mb-10 font-bold text-center text-slate-300">
                  로그인
                </motion.p>
                <motion.div className="flex flex-col">
                  <input
                    className="focus:outline-none placeholder:text-sm placeholder:text-slate-300 border-2 border-hoverSpanMenu rounded-2xl bg-transparent px-3 py-3 text-md mb-3 shadow-md"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      handleInputChanged(e, setLoginEmail);
                    }}
                    placeholder="이메일"
                  />
                  <input
                    className="focus:outline-none placeholder:text-sm  placeholder:text-slate-300 border-2 border-hoverSpanMenu rounded-2xl bg-transparent px-3 py-3 text-md shadow-md"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      handleInputChanged(e, setLoginPassword);
                    }}
                    placeholder="비밀번호"
                  />
                </motion.div>
                <div className="flex w-1/2 items-center justify-center mt-10 mb-3">
                  <hr className="w-1/4 border-slate-300" />
                  <span className="text-sm text-slate-300 mx-2">또는</span>
                  <hr className="w-1/4 border-slate-300" />
                </div>
                <div className="flex w-1/2 items-center justify-center mb-10 space-x-2">
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
                  <Tooltip placement="top" title="가입" arrow>
                    <motion.span
                      onClick={() => {
                        setLeftPart("SIGNUP");
                      }}
                      whileHover={{ y: "-10%" }}
                      style={{ fontSize: "1.2rem", backgroundColor: "#eee" }}
                      className="cursor-pointer material-symbols-outlined px-2 py-2 rounded-full shadow-md font-semibold"
                    >
                      person_add
                    </motion.span>
                  </Tooltip>
                </div>
                <motion.div className="w-1/2 flex items-center justify-center text-sm space-x-3">
                  <motion.span
                    onClick={() => {
                      setLeftPart("INTRO");
                    }}
                    whileHover={{ y: "-10%" }}
                    style={{ fontSize: "1.2rem", backgroundColor: "#eee" }}
                    className="px-3 py-3 rounded-full shadow-md font-semibold cursor-pointer material-symbols-outlined"
                  >
                    home
                  </motion.span>
                  <motion.span
                    onClick={() => {
                      try {
                        loginWithEmailAndPassword(loginEmail, loginPassword);
                      } catch (error: any) {
                        switch (error.code) {
                          case "auth/invalid-email":
                            setAlarm([
                              "유효하지 않는 이메일 입니다.",
                              "error",
                              true,
                            ]);
                            break;

                          case "auth/wrong-password":
                            setAlarm(["틀린 비밀번호 입니다.", "error", true]);
                            break;

                          default:
                            setAlarm([
                              "로그인에 실패하였습니다.",
                              "error",
                              true,
                            ]);
                            break;
                        }
                        setTimeout(() => {
                          setAlarm(["", "success", false]);
                        }, 2000);
                      }
                    }}
                    whileHover={{ y: "-10%" }}
                    style={{ fontSize: "1.2rem", backgroundColor: "#eee" }}
                    className="px-3 py-3 rounded-full shadow-md font-semibold cursor-pointer material-symbols-outlined"
                  >
                    check
                  </motion.span>
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
                  <div className="relative mb-3">
                    <input
                      className="focus:outline-none border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md shadow-md"
                      type="email"
                      readOnly={verificatedEmail !== ""}
                      value={signupEmail}
                      onChange={(e) => {
                        handleInputChanged(e, setSignupEmail);
                      }}
                      placeholder="이메일"
                    />
                    {!verificatedEmail && (
                      <motion.button
                        onClick={async () => {
                          const doesExist = await doesEmailExist(signupEmail);
                          if (!doesExist) {
                            try {
                              await verifyEmail(signupEmail);
                              window.localStorage.setItem(
                                "verificatedEmail",
                                signupEmail
                              );
                              const result = window.confirm(
                                "이제 이 창을 닫고 이메일 인증을 진행하면 됩니다. 닫으시겠습니까?"
                              );
                              result && window.close();
                            } catch (error: any) {
                              switch (error.code) {
                                case "auth/invalid-email":
                                  setAlarm([
                                    "유효한 이메일이 아닙니다.",
                                    "error",
                                    true,
                                  ]);
                                  break;
                                case "auth/missing-email":
                                  setAlarm([
                                    "이메일을 입력해주세요.",
                                    "error",
                                    true,
                                  ]);
                                  break;
                                default:
                                  setAlarm([
                                    "에러가 발생했습니다.",
                                    "error",
                                    true,
                                  ]);
                                  break;
                              }
                            }
                          } else {
                            setAlarm([
                              "이미 존재하는 이메일 입니다.",
                              "error",
                              true,
                            ]);
                          }
                          setTimeout(() => {
                            setAlarm(["", "success", false]);
                          }, 2000);
                        }}
                        whileHover={{ y: "-10%" }}
                        style={{
                          fontSize: "0.7rem",
                          translateY: "-50%",
                          top: "50%",
                        }}
                        className="px-3 py-3 rounded-full bg-white shadow-md font-semibold absolute w-fit ml-3"
                      >
                        인증
                      </motion.button>
                    )}
                    {verificatedEmail && (
                      <span className="material-symbols-outlined absolute text-sm right-2 text-blue-500">
                        check_circle
                      </span>
                    )}
                  </div>
                  {verificatedEmail && (
                    <>
                      <div className="relative">
                        {signupName.length > 0 && signupName.length <= 2 ? (
                          <span
                            style={{ fontSize: "0.7rem" }}
                            className="absolute right-2 text-red-500"
                          >
                            3자 이상이 되어야 합니다!
                          </span>
                        ) : signupName.length === 0 ? (
                          <></>
                        ) : (
                          <span className="material-symbols-outlined absolute text-sm right-2 text-blue-500">
                            check_circle
                          </span>
                        )}
                        <motion.input
                          key="signupName"
                          layout
                          onChange={(e) => {
                            handleInputChanged(e, setSignupName);
                          }}
                          value={signupName}
                          className="focus:outline-none border border-logoBrown rounded-2xl bg-transparent px-3 py-3 mb-3 text-md shadow-md"
                          type="text"
                          placeholder="닉네임"
                          minLength={2}
                          maxLength={15}
                        />
                      </div>
                      <AnimatePresence>
                        <div className="relative">
                          <motion.input
                            key="signupPassword"
                            layout
                            onChange={(e) => {
                              handleInputChanged(e, setSignupPassword);
                            }}
                            value={signupPassword}
                            className="focus:outline-none border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md mb-3 shadow-md"
                            required
                            type="password"
                            minLength={5}
                            placeholder="비밀번호"
                          />{" "}
                          {signupPassword.length > 0 &&
                          signupPassword.length <= 5 ? (
                            <span
                              style={{ fontSize: "0.7rem" }}
                              className="absolute right-2 text-red-500"
                            >
                              6자 이상이 되어야 합니다!
                            </span>
                          ) : signupPassword.length === 0 ? (
                            <></>
                          ) : (
                            <span className="material-symbols-outlined absolute text-sm right-2 text-blue-500">
                              check_circle
                            </span>
                          )}
                        </div>
                        {signupPassword.length >= 6 && (
                          <div className="relative">
                            <motion.input
                              animate={{ opacity: [0, 1] }}
                              exit={{ opacity: [1, 0] }}
                              key="ConfirmSignupPassword"
                              onUnmount={() => {
                                setSignupConfirmPassword("");
                              }}
                              onChange={(e) => {
                                handleInputChanged(e, setSignupConfirmPassword);
                              }}
                              value={signupConfirmPassword}
                              className="focus:outline-none border border-logoBrown rounded-2xl bg-transparent px-3 py-3 text-md shadow-md"
                              type="password"
                              minLength={5}
                              placeholder="비밀번호 확인"
                            />
                            {signupConfirmPassword !== signupPassword ? (
                              <span
                                style={{ fontSize: "0.7rem" }}
                                className="absolute right-2 text-red-500"
                              >
                                비밀번호가 다릅니다!
                              </span>
                            ) : (
                              <span className="material-symbols-outlined absolute text-sm right-2 text-blue-500">
                                check_circle
                              </span>
                            )}
                          </div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>

                <motion.div className="w-1/2 mt-10 flex items-center justify-center text-sm space-x-3">
                  <Tooltip placement="top" title="처음으로" arrow>
                    <motion.span
                      onClick={() => {
                        setLeftPart("INTRO");
                      }}
                      whileHover={{ y: "-10%" }}
                      style={{ fontSize: "1.2rem", backgroundColor: "#eee" }}
                      className="px-3 py-3 rounded-full bg-white shadow-md font-semibold cursor-pointer material-symbols-outlined"
                    >
                      home
                    </motion.span>
                  </Tooltip>

                  <Tooltip placement="top" title="로그인" arrow>
                    <motion.span
                      onClick={() => {
                        setLeftPart("LOGIN");
                      }}
                      style={{ fontSize: "1.2rem", backgroundColor: "#eee" }}
                      whileHover={{ y: "-10%" }}
                      className="px-3 py-3 cursor-pointer rounded-full bg-white shadow-md font-semibold material-symbols-outlined"
                    >
                      login
                    </motion.span>
                  </Tooltip>
                  {verificatedEmail &&
                    signupName.length >= 3 &&
                    signupPassword.length >= 6 &&
                    signupPassword === signupConfirmPassword && (
                      <motion.button
                        onClick={() => {
                          createAccountWithEmailAndPassword(
                            signupEmail,
                            signupPassword,
                            signupName,
                            navigator
                          );
                        }}
                        whileHover={{ y: "-10%" }}
                        style={{ fontSize: "1.2rem", backgroundColor: "#eee" }}
                        className="px-3 py-3 rounded-full bg-white shadow-md font-semibold"
                      >
                        확인
                      </motion.button>
                    )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="-z-0 absolute top-0 left-0 w-full h-full opacity-80 GalaxyS20Ultra:invisible">
          <img
            className="w-full h-full fit-cover"
            src="backgroundImage/main.jpg"
            alt="background"
          />
        </div>

        <div className="GalaxyS20Ultra:visible GalaxyS20Ultra:w-full GalaxyS20Ultra:h-full GalaxyS20Ultra:absolute GalaxyS20Ultra:bg-genreSelectedBG"></div>
        <div className="absolute right-3 bottom-3">
          <span className="text-slate-300 text-sm">
            Photo by{" "}
            <a href="https://unsplash.com/@patrickian4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Patrick Fore
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/s/photos/writing?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default Intro;
