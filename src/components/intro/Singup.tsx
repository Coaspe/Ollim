import { Tooltip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, } from "react-router-dom";
import { createAccountWithEmailAndPassword, verifyEmail } from "../../helpers/auth-email";
import { useAppDispatch } from "../../hooks/useRedux";
import useProfileData from "../../hooks/useVerification";
import { alarmAction } from "../../redux";
import { doesEmailExist } from "../../services/firebase";
import { alarmType, leftPartType } from "../../type";

interface props {
  setLeftPart: React.Dispatch<React.SetStateAction<leftPartType>>;
}
const Signup: React.FC<props> = ({ setLeftPart }) => {
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const verificatedEmail = useProfileData();
  const [signupEmail, setSignupEmail] = useState(verificatedEmail);
  const dispatch = useAppDispatch();
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };
  const handleInputChanged = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState(e.target.value);
  };
  const navigator = useNavigate()
  useEffect(() => {
    setSignupEmail(verificatedEmail);
  }, [verificatedEmail]);
  const handleEmailVerification = async () => {
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
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      key="SIGNUP"
      className="w-full flex flex-col z-10 items-center"
    >
      <motion.p className="w-1/2 text-3xl whitespace-pre-line mb-10 font-bold text-center">
        가입
      </motion.p>
      <motion.div className="flex justify-between items-center">
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
        <motion.span
          onClick={handleEmailVerification}
          whileHover={{ y: "-10%" }}
          className={`cursor-pointer text-3xl font-semibold ml-3  material-symbols-outlined ${verificatedEmail ?? "text-blue-500"}`}>
          check_circle
        </motion.span>
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
  );
};

export default Signup;
