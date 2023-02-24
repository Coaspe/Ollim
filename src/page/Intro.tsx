import { Alert } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  alertVariants,
} from "../constants";
import { useAppSelector } from "../hooks/useRedux";
import { RootState } from "../redux/store";
import { leftPartType } from "../type";
import BackgroundImage from "../components/intro/BackgroundImage";
import Greeting from "../components/intro/Greeting";
import Signup from "../components/intro/Singup";
import Login from "../components/intro/Login";

const Intro = () => {

  // Intro screen has two parts, left and right.
  const [leftPart, setLeftPart] = useState<leftPartType>(
    "INTRO"
  );
  const navigator = useNavigate();
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
      <motion.div className="flex flex-col h-screen w-screen font-noto">
        <BackgroundImage />
        <div className="z-10 w-full h-20 flex items-center justify-between GalaxyS20Ultra:h-0">
          {/* logo */}
          <img
            className="h-28 GalaxyS20Ultra:hidden GalaxyS20Ultra:h-0"
            src="logo/Ollim-logos_transparent.png"
            alt="header logo"
          />
        </div>
        <div className="w-4/5 h-full flex z-10 items-center justify-center GalaxyS20Ultra:w-full GalaxyS20Ultra:px-10">
          <AnimatePresence exitBeforeEnter>
            {leftPart === "INTRO" ?
              <Greeting setLeftPart={setLeftPart} navigator={navigator} />
              : leftPart === "LOGIN" ? <Login setLeftPart={setLeftPart} navigator={navigator} />
                : <Signup setLeftPart={setLeftPart} navigator={navigator} />}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default Intro;
