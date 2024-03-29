import { Alert } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  alertVariants,
} from "../constants";
import { useAppSelector } from "../hooks/useRedux";
import { RootState } from "../redux/store";
import { leftPartType } from "../type";
import Greeting from "../components/intro/Greeting";
import Signup from "../components/intro/Singup";
import Login from "../components/intro/Login";
import '../style/Background.css'
import BackgroundImageCopyRight from "../components/intro/BackgroundImage";
import IntroHeader from "../components/header/IntroHeader";

const Intro = () => {

  // Intro screen has two parts, left and right.
  const [leftPart, setLeftPart] = useState<leftPartType>(
    "INTRO"
  );
  const alarm = useAppSelector((state: RootState) => state.setAlarm.alarm);

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
      <motion.div className="bg-img flex flex-col font-noto">
        {/* Header */}
        <IntroHeader />
        <div className="w-4/5 h-full flex z-10 items-center justify-center GalaxyS20Ultra:w-full GalaxyS20Ultra:px-10">
          {/* Main contents */}
          <AnimatePresence exitBeforeEnter>
            {leftPart === "INTRO" ?
              <Greeting setLeftPart={setLeftPart} />
              : leftPart === "LOGIN" ? <Login setLeftPart={setLeftPart} />
                : <Signup setLeftPart={setLeftPart} />}
          </AnimatePresence>
        </div>
      </motion.div>
      <BackgroundImageCopyRight />
    </>
  );
};

export default Intro;
