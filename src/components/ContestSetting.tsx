import axios from "axios";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { alarmAction } from "../redux";
import { alarmType, getFirestoreContest } from "../type";
import { motion } from "framer-motion";
import SpinningSvg from "./SpinningSvg";
import UserContext from "../context/user";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDateTimePicker from "@mui/lab/DesktopDateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextField } from "@mui/material";

interface props {
  contestInfo: getFirestoreContest;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  contestDocID: string;
  deadline: string;
  setDeadline: React.Dispatch<React.SetStateAction<string>>;
}

const ContestSetting: React.FC<props> = ({
  contestInfo,
  title,
  setTitle,
  description,
  setDescription,
  contestDocID,
  deadline,
  setDeadline,
}) => {
  const dispatch = useDispatch();
  const { user: countextUser } = useContext(UserContext);
  // Delete modal variables
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const navigate = useNavigate();
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };

  // To prohibit indiscriminate request, use disable state.
  const [titleSaveButtonDisabled, setTitleSaveButtonDisabled] = useState(false);
  const [synopsisSaveButtonDisabled, setSynopsisSaveButtonDisabled] =
    useState(false);
  const [disclosureSaveButtonDisabled, setDisclosureSaveButtonDisabled] =
    useState(false);
  const handleDeadlineChange = (date: any) => {
    setDeadline(date);
  };
  return (
    <div className="w-full font-noto flex flex-col items-start px-20 my-20 space-y-20 GalaxyS20Ultra:px-10">
      {/* Title div */}
      <div className="flex flex-col w-2/3 GalaxyS20Ultra:w-full">
        <div className="flex items-center mb-10">
          <span className="text-2xl font-bold mr-10">제목</span>
          <button
            disabled={titleSaveButtonDisabled}
            style={{ fontSize: "0.75rem" }}
            onClick={() => {
              if (contestInfo.title !== title) {
                setTitleSaveButtonDisabled(true);
                axios
                  .post(`https://ollim.herokuapp.com/updateContestTitle`, {
                    contestDocID,
                    title,
                  })
                  .then((res) => {
                    setAlarm(res.data);
                    setTitleSaveButtonDisabled(false);
                    setTimeout(() => {
                      setAlarm(["", "success", false]);
                    }, 2000);
                  });
              }
            }}
            className="flex items-center justify-center border border-blue-400 px-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100"
          >
            {titleSaveButtonDisabled ? <SpinningSvg /> : "저장"}
          </button>
        </div>
        <input
          style={{ backgroundColor: "#FAF6F5" }}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="border-opacity-5 shadow-lg px-3 py-2 border border-black w-fit overflow-x-scroll focus:outline-none"
        />
      </div>

      {/* Synopsis div */}
      <div className="flex flex-col w-2/3 GalaxyS20Ultra:w-full">
        <div className="flex items-center mb-10">
          <span className="text-2xl font-bold mr-10">설명</span>
          <button
            style={{ fontSize: "0.75rem" }}
            disabled={synopsisSaveButtonDisabled}
            onClick={() => {
              if (contestInfo.description !== description) {
                setSynopsisSaveButtonDisabled(true);
                axios
                  .post(
                    `https://ollim.herokuapp.com/updateContestDescription`,
                    {
                      contestDocID,
                      description,
                    }
                  )
                  .then((res) => {
                    setAlarm(res.data);
                    setSynopsisSaveButtonDisabled(false);
                    setTimeout(() => {
                      setAlarm(["", "success", false]);
                    }, 2000);
                  });
              }
            }}
            className="border border-blue-400 px-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100"
          >
            저장
          </button>
        </div>
        <textarea
          style={{ backgroundColor: "#FAF6F5" }}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="border-opacity-5 shadow-lg resize-none px-3 py-3 border border-black w-full h-72 overflow-y-scroll bg-transparent focus:outline-none"
        >
          {description}
        </textarea>
      </div>

      {/* Deadline div */}
      <div className="flex flex-col items-start w-1/3 GalaxyS20Ultra:w-full">
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-10">마감</span>
          <button
            disabled={disclosureSaveButtonDisabled}
            style={{ fontSize: "0.75rem" }}
            onClick={() => {
              if (contestInfo.deadline !== deadline) {
                setDisclosureSaveButtonDisabled(true);
                axios
                  .post(`https://ollim.herokuapp.com/updateDisclosure`, {
                    contestDocID,
                    deadline,
                  })
                  .then((res) => {
                    setAlarm(res.data);
                    setDisclosureSaveButtonDisabled(false);
                    setTimeout(() => {
                      setAlarm(["", "success", false]);
                    }, 2000);
                  });
              }
            }}
            className="border border-blue-400 px-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100"
          >
            저장
          </button>
        </div>
        <div className="w-full flex items-center justify-between mt-5 py-2 px-3">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateTimePicker
              value={deadline}
              onChange={handleDeadlineChange}
              renderInput={(params: any) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
      </div>

      {/* Delete modal*/}
      {deleteModalOpen && (
        <motion.div
          style={{ zIndex: 10000 }}
          animate={{
            backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
          }}
          transition={{ duration: 0.2 }}
          className="fixed w-full h-full items-center justify-center top-0 left-0 flex"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteModalOpen(false);
            setDeleteInput("");
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center justify-center h-fit bg-white px-10 py-10"
          >
            <div className="flex flex-col">
              <span className="text-2xl mb-5 text-red-500 font-bold">경고</span>
              <span>삭제 시 복구가 불가능 합니다.</span>
              <span>
                그럼에도 삭제를 원하신다면{" "}
                <span className="text-xl font-bold">{contestInfo.title}</span>{" "}
                을 입력해주세요.
              </span>
              <div className="mt-5">
                <input
                  spellCheck={false}
                  value={deleteInput}
                  onChange={(e) => {
                    setDeleteInput(e.target.value);
                  }}
                  className="border mr-5 px-2 py-2 rounded-xl focus:outline-none"
                  type="text"
                />
                <button
                  onClick={() => {
                    axios
                      .post(`https://ollim.herokuapp.com/deleteWriting`, {
                        contestDocID,
                      })
                      .then((res) => {
                        setAlarm(res.data);
                        setDeleteModalOpen(false);
                        res.data[1] === "success" &&
                          navigate(`/${countextUser.uid}`);
                        setTimeout(() => {
                          setAlarm(["", "success", false]);
                        }, 3000);
                      });
                  }}
                  disabled={deleteInput !== contestInfo.title}
                  className={`border px-2 py-2 text-center rounded-full text-sm ${
                    deleteInput === contestInfo.title && "text-red-500"
                  } `}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Delete div */}
      <div className="flex flex-col items-start w-1/3 GalaxyS20Ultra:w-full">
        <div className="flex flex-col">
          <span className="text-2xl font-bold mb-10">글 삭제</span>
          <button
            className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG`}
            onClick={() => {
              setDeleteModalOpen(true);
            }}
          >
            삭제 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestSetting;
