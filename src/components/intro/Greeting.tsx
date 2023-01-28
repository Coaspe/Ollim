import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { NavigateFunction } from "react-router-dom";
import { loginWithEmailAndPassword } from "../../helpers/auth-email";
import { leftPartType } from "../../type";
import { pVariants, pVariants2, divVariants } from "../constants/variants";

interface props {
  setLeftPart: React.Dispatch<React.SetStateAction<leftPartType>>;
  navigator: NavigateFunction;
}
const Greeting: React.FC<props> = ({ setLeftPart, navigator }) => {
  return (
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
        <Tooltip title="로그인" placement="top" arrow>
          <motion.img
            whileHover={{ y: "-10%" }}
            className="px-2 py-2 w-12 rounded-full bg-white shadow-md font-semibold cursor-pointer"
            onClick={() => {
              setLeftPart("LOGIN");
            }}
            src="/icon/login.png"
          />
        </Tooltip>
        <Tooltip title="커뮤니티" placement="top" arrow>
          <motion.img
            style={{ backgroundColor: "#c69e92" }}
            onClick={() => {
              navigator("/community");
            }}
            whileHover={{ y: "-10%" }}
            className="px-2 py-2 w-12 rounded-full shadow-md font-semibold mx-5 cursor-pointer"
            src="/icon/browse.png"
          />
        </Tooltip>
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
  );
};

export default Greeting;
