import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmailAndPassword } from "../../helpers/auth-email";
import { signInWithGoogle } from "../../helpers/auth-OAuth2";
import { useAppDispatch } from "../../hooks/useRedux";
import { alarmAction } from "../../redux";
import { alarmType, leftPartType } from "../../type";

interface props {
  setLeftPart: React.Dispatch<React.SetStateAction<leftPartType>>;
}
const Login: React.FC<props> = ({ setLeftPart }) => {
  const navi = useNavigate()
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const handleInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(e.target.value);
  };
  const dispatch = useAppDispatch();
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };

  const handleLoginWithEmailAndPassword = async (loginEmail: string, loginPassword: string) => {
    try {
      await loginWithEmailAndPassword(loginEmail, loginPassword);
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
      throw error
    }
  }
  return (
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
          className="focus:outline-none text-slate-300 placeholder:text-sm placeholder:text-slate-300 border-2 border-slate-300 rounded-2xl bg-transparent px-3 py-3 text-md mb-3 shadow-md"
          type="email"
          value={loginEmail}
          onChange={(e) => {
            handleInputChanged(e, setLoginEmail);
          }}
          placeholder="이메일"
        />
        <input
          className="focus:outline-none text-slate-300 placeholder:text-sm placeholder:text-slate-300 border-2 border-slate-300 rounded-2xl bg-transparent px-3 py-3 text-md shadow-md"
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
              signInWithGoogle(navi)
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
        <Tooltip placement="top" title="뒤로" arrow>
          <motion.span
            onClick={() => {
              setLeftPart("INTRO");
            }}
            whileHover={{ y: "-10%" }}
            style={{ fontSize: "1.2rem", backgroundColor: "#eee" }}
            className="px-3 py-3 rounded-full shadow-md font-semibold cursor-pointer material-symbols-outlined"
          >
            arrow_back
          </motion.span>
        </Tooltip>
        <motion.span
          onClick={() => {
            handleLoginWithEmailAndPassword(loginEmail, loginPassword)
          }}
          whileHover={{ y: "-10%" }}
          style={{ fontSize: "1.2rem", backgroundColor: "#eee" }}
          className="px-3 py-3 rounded-full shadow-md font-semibold cursor-pointer material-symbols-outlined"
        >
          check
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default Login;
