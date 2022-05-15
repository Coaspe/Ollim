import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { NavigateFunction } from "react-router-dom";
import { signInWithGoogle } from "../../helpers/auth-OAuth2";
import { leftPartType } from "../../type";

interface props {
  setLeftPart: React.Dispatch<React.SetStateAction<leftPartType>>;
  navigator: NavigateFunction;
}
const Login: React.FC<props> = ({ setLeftPart, navigator }) => {
  return (
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
  );
};

export default Login;
