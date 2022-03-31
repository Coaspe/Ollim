import { Tooltip } from "@mui/material";
import axios from "axios";
import "../style/NewContestModal.css";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alarmAction } from "../redux";
import { RootState } from "../redux/store";
import { genre, alarmType, addContestArg } from "../type";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDateTimePicker from "@mui/lab/DesktopDateTimePicker";

interface NewContestProps {
  setNewContestModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewContestModal: React.FC<NewContestProps> = ({
  setNewContestModalOpen,
}) => {
  const [genrnState, setGenrn] = useState<genre>("NOVEL");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [limitNumOfPeople, setLimitNumOfPeople] = useState<number | "">(5);
  const [deadline, setDeadline] = useState<string>(new Date().toString());
  const dispatch = useDispatch();

  const userInfo = useSelector(
    (state: RootState) => state.setUserInfo.userInfo
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);
  const handleNumOfPeople = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.validity.valid &&
      setLimitNumOfPeople(() => {
        const value = e.target.value;
        return value ? parseInt(value) : "";
      });
  };
  const handleOnBlur = () => {
    !limitNumOfPeople && setLimitNumOfPeople(5);
  };
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };
  // https://ollim.herokuapp.com
  const handleAddContest = () => {
    const data: addContestArg = {
      limitNumOfPeople: limitNumOfPeople as number,
      title,
      description,
      genre: genrnState,
      hostEmail: userInfo.userEmail,
      deadline,
      dateCreated: new Date().getTime(),
      writings: {},
    };
    axios
      .post(`https://ollim.herokuapp.com/addContest`, {
        data: JSON.stringify(data),
      })
      .then((res) => {
        setAlarm(res.data);
        setTimeout(() => {
          setAlarm(["", "success", false]);
        }, 3000);
        if (res.data[1] === "success") {
          window.location.reload();
        }
      });
  };

  const handleDeadlineChange = (date: any) => {
    setDeadline(date);
  };
  const handleModalClose = () => {
    setNewContestModalOpen(false);
  };

  return (
    <motion.div
      className="font-noto flex items-center justify-center z-20 fixed w-full h-full"
      animate={{
        backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
      }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      {userInfo && (
        <div
          style={{ backgroundColor: "#faf6f5" }}
          className="relative w-1/2 h-3/4 flex flex-col items-center justify-center rounded-xl"
        >
          <span
            onClick={handleModalClose}
            className="material-icons absolute top-5 left-5 cursor-pointer"
          >
            close
          </span>
          <AnimatePresence>
            {title && new Date(deadline).getTime() > new Date().getTime() && (
              <motion.svg
                whileHover={{ y: "-10%" }}
                x="0px"
                y="0px"
                fill="none"
                className={`absolute top-5 right-5 w-8 cursor-pointer`}
                viewBox="0 0 50 50"
                onClick={() => {
                  setNewContestModalOpen(false);
                  handleAddContest();
                }}
              >
                <motion.path
                  stroke="#49b675"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  animate={{ pathLength: [0, 1] }}
                  exit={{ pathLength: [1, 0] }}
                  d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17-7.6 17-17 17zm0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15z"
                />
                <motion.path
                  stroke="#49b675"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  animate={{ pathLength: [0, 1] }}
                  exit={{ pathLength: [1, 0] }}
                  d="M23 32.4l-8.7-8.7 1.4-1.4 7.3 7.3 11.3-11.3 1.4 1.4z
               "
                />
              </motion.svg>
            )}
          </AnimatePresence>
          <div className="w-3/4 h-5/6 flex flex-col items-center justify-between">
            {/* Genrn, isCollection, Disclosure Div */}
            <div className="flex w-full h-1/3 items-center justify-between">
              {/* Genrn div */}
              <div className="flex flex-col items-start w-5/12 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">장르</span>
                </div>
                <div className="flex justify-between items-center mt-5 w-full">
                  <Tooltip title="소설" placement="top" arrow>
                    <span
                      onClick={() => {
                        setGenrn("NOVEL");
                      }}
                      style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                      className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor ${
                        genrnState === "NOVEL"
                          ? "text-slate-700 bg-genreSelectedBG"
                          : "text-slate-400"
                      }`}
                    >
                      menu_book
                    </span>
                  </Tooltip>
                  <Tooltip title="시" placement="top" arrow>
                    <span
                      onClick={() => {
                        setGenrn("POEM");
                      }}
                      style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                      className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor ${
                        genrnState === "POEM"
                          ? "text-slate-700 bg-genreSelectedBG"
                          : "text-slate-400"
                      }`}
                    >
                      history_edu
                    </span>
                  </Tooltip>
                  <Tooltip title="시나리오" placement="top" arrow>
                    <span
                      onClick={() => {
                        setGenrn("SCENARIO");
                      }}
                      style={{ fontSize: "1.5rem", borderColor: "#e4d0ca" }}
                      className={`material-icons cursor-pointer border py-2 px-2 rounded-full hover:text-slate-500 hover:bg-hoverBGColor ${
                        genrnState === "SCENARIO"
                          ? "text-slate-700 bg-genreSelectedBG"
                          : "text-slate-400"
                      }`}
                    >
                      adf_scanner
                    </span>
                  </Tooltip>
                </div>
              </div>

              {/* Is Collection? */}
              <div className="flex flex-col items-start w-5/12 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">인원 제한</span>
                </div>
                <div className="flex items-center mt-5">
                  <div
                    style={{ borderColor: "#e4d0ca" }}
                    className="border rounded-2xl flex items-center w-1/2 justify-between px-5 bg-white"
                  >
                    <input
                      onChange={handleNumOfPeople}
                      onBlur={handleOnBlur}
                      value={limitNumOfPeople}
                      placeholder="5"
                      className="w-2/3 py-2 focus:outline-none appearance-none bg-transparent"
                      pattern="^[0-9]+$|^$"
                      type="text"
                    />
                    <span className="text-gray-400">명</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title, First element's title div */}
            <div className="flex w-full h-1/3 items-center justify-between">
              {/* Title */}
              <div className="flex flex-col items-start w-5/12 h-full">
                <div className="flex items-center">
                  <span className="text-xl font-bold">백일장 이름</span>
                </div>
                <input
                  style={{ borderColor: "#e4d0ca" }}
                  className="font-md border-2 py-2 px-3 mt-5 rounded-xl w-full placeholder:italic focus:outline-none"
                  placeholder="백일장의 이름을 입력하세요"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>

              <div className="flex flex-col items-start w-5/12 h-full">
                <div className="flex items-center">
                  <span className="text-xl font-bold">마감</span>
                </div>
                <div className="flex items-center w-full justify-between space-x-3 mt-5">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDateTimePicker
                      value={deadline}
                      onChange={handleDeadlineChange}
                      renderInput={(params: any) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>

            {/* Opening article div */}
            <div className="flex flex-col items-start w-full h-1/3">
              <span className="text-xl font-bold">백일장 설명</span>
              <textarea
                style={{ borderColor: "#e4d0ca" }}
                className="resize-none border-2 pt-2 px-3 mt-5 rounded-xl h-full w-full italic"
                placeholder="백일장에 대한 설명을 입력하세요"
                value={description}
                spellCheck="false"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NewContestModal;
