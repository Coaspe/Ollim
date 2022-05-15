import { motion } from "framer-motion";
import { NavigateFunction } from "react-router-dom";
import { leftPartType } from "../../type";

interface props {
  setLeftPart: React.Dispatch<React.SetStateAction<leftPartType>>;
  navigator: NavigateFunction;
}
const Greeting: React.FC<props> = ({ setLeftPart, navigator }) => {
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
        <span className="text-4xl text-logoBrown font-extrabold">올림</span>{" "}
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
  );
};

export default Greeting;
