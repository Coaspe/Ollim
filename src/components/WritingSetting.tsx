import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alarmAction } from "../redux";
import { alarmType, getFirestoreWriting, disclosure } from "../type";
import { motion } from "framer-motion";
import SpinningSvg from "./SpinningSvg";
import { useAppDispatch } from "../hooks/useRedux";

interface props {
  writingInfo: getFirestoreWriting;
  synopsis: string;
  setSynopsis: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  writingDocID: string;
  disclosure: string;
  setDisclosure: React.Dispatch<React.SetStateAction<disclosure>>;
  bgm: string;
  setBgm: React.Dispatch<React.SetStateAction<string>>;
}

const WritingSetting: React.FC<props> = ({
  writingInfo,
  title,
  setTitle,
  synopsis,
  setSynopsis,
  writingDocID,
  disclosure,
  setDisclosure,
  bgm,
  setBgm,
}) => {
  const dispatch = useAppDispatch();

  // Delete modal variables
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const navigate = useNavigate();
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };

  // BGM file input state
  const [mp4File, setMp4File] = useState<File>();
  // Auido tag ref
  const audioRef = useRef<HTMLAudioElement>(null);

  // To prohibit indiscriminate request, use disable state.
  const [titleSaveButtonDisabled, setTitleSaveButtonDisabled] = useState(false);
  const [synopsisSaveButtonDisabled, setSynopsisSaveButtonDisabled] =
    useState(false);
  const [disclosureSaveButtonDisabled, setDisclosureSaveButtonDisabled] =
    useState(false);
  const [exportFile, setExportFile] = useState("HANCOM");

  // Handle BGM file changed
  const handleBGMChange = () => {
    if (mp4File) {
      const formData = new FormData();
      formData.append("userUID", writingInfo.userUID);
      formData.append("writingDocID", writingDocID);
      formData.append("file", mp4File);
      // https://ollim.herokuapp.com
      axios
        .post(`https://ollim.herokuapp.com/updateBGM`, formData)
        .then((res) => {
          setAlarm(res.data);
          setTimeout(() => {
            setAlarm(["", "success", false]);
          }, 3000);
        });
    }
  };
  // Set preview BGM
  const handleWebBGM = (event: any) => {
    setMp4File(event.target.files[0]);
    setBgm(URL.createObjectURL(event.target.files[0]));
  };

  // When changed bgm state, execute pause(), load()
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      // audioRef.current.play();
    }
  }, [bgm]);
  return (
    <div className="w-full font-noto flex flex-col items-start px-20 my-20 space-y-20 GalaxyS20Ultra:px-10">
      {/* Title div */}
      <div className="flex flex-col w-2/3 GalaxyS20Ultra:w-full">
        <div className="flex items-center mb-10">
          <span className="text-2xl font-bold mr-10">??????</span>
          <button
            disabled={titleSaveButtonDisabled}
            style={{ fontSize: "0.75rem" }}
            onClick={() => {
              if (writingInfo.title !== title) {
                setTitleSaveButtonDisabled(true);
                axios
                  .post(`https://ollim.herokuapp.com/updateTitle`, {
                    genre: writingInfo.genre,
                    writingDocID,
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
            {titleSaveButtonDisabled ? <SpinningSvg /> : "??????"}
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
          <span className="text-2xl font-bold mr-10">
            {writingInfo.genre !== "POEM" ? "????????????" : "?????? ???"}
          </span>
          <button
            style={{ fontSize: "0.75rem" }}
            disabled={synopsisSaveButtonDisabled}
            onClick={() => {
              if (writingInfo.synopsis !== synopsis) {
                setSynopsisSaveButtonDisabled(true);
                axios
                  .post(`https://ollim.herokuapp.com/updateSynopsis`, {
                    genre: writingInfo.genre,
                    writingDocID,
                    synopsis,
                  })
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
            ??????
          </button>
        </div>
        <textarea
          style={{ backgroundColor: "#FAF6F5" }}
          value={synopsis}
          onChange={(e) => {
            setSynopsis(e.target.value);
          }}
          className="border-opacity-5 shadow-lg resize-none px-3 py-3 border border-black w-full h-72 overflow-y-scroll bg-transparent focus:outline-none"
        >
          {synopsis}
        </textarea>
      </div>

      {/* BGM div */}
      {writingInfo.genre === "POEM" && (
        <div className="flex flex-col w-2/3 GalaxyS20Ultra:w-full">
          <div className="flex items-center mb-10">
            <span className="text-2xl font-bold mr-10">?????? ??????</span>
            <button
              style={{ fontSize: "0.75rem" }}
              disabled={synopsisSaveButtonDisabled}
              onClick={handleBGMChange}
              className="border border-blue-400 px-3 mr-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100"
            >
              ??????
            </button>
            <label htmlFor="bgm">
              <span
                style={{ fontSize: "0.75rem" }}
                className="cursor-pointer border border-blue-400 px-3 py-1 rounded-xl text-blue-400 hover:bg-blue-100"
              >
                ??????
              </span>
            </label>
            <input
              style={{ display: "none" }}
              id="bgm"
              onChange={handleWebBGM}
              type="file"
              accept="audio/*"
            />
          </div>
          <audio controls ref={audioRef}>
            <source src={bgm} type="audio/mpeg" />
          </audio>
        </div>
      )}

      {/* Disclosure div */}
      <div className="flex flex-col items-start w-1/3 GalaxyS20Ultra:w-full">
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-10">?????? ??????</span>
          <button
            disabled={disclosureSaveButtonDisabled}
            style={{ fontSize: "0.75rem" }}
            onClick={() => {
              if (writingInfo.disclosure !== disclosure) {
                setDisclosureSaveButtonDisabled(true);
                axios
                  .post(`https://ollim.herokuapp.com/updateDisclosure`, {
                    genre: writingInfo.genre,
                    writingDocID,
                    disclosure,
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
            ??????
          </button>
        </div>
        <div className="w-full flex items-center justify-between mt-5 py-2 px-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG ${
              disclosure === "PUBLIC" &&
              "bg-genreSelectedBG shadow-genreSelectedBG shadow-md"
            }`}
            onClick={() => {
              setDisclosure("PUBLIC");
            }}
          >
            ??????
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG ${
              disclosure === "FOLLOWERS" &&
              "bg-genreSelectedBG shadow-genreSelectedBG shadow-md"
            }`}
            onClick={() => {
              setDisclosure("FOLLOWERS");
            }}
          >
            ?????????
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG ${
              disclosure === "PRIVATE" &&
              "bg-genreSelectedBG shadow-genreSelectedBG shadow-md"
            }`}
            onClick={() => {
              setDisclosure("PRIVATE");
            }}
          >
            ?????????
          </motion.button>
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
              <span className="text-2xl mb-5 text-red-500 font-bold">??????</span>
              <span>?????? ??? ????????? ????????? ?????????.</span>
              <span>
                ???????????? ????????? ???????????????{" "}
                <span className="text-xl font-bold">{writingInfo.title}</span>{" "}
                ??? ??????????????????.
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
                        writingDocID,
                        genre: writingInfo.genre,
                      })
                      .then((res) => {
                        setAlarm(res.data);
                        setDeleteModalOpen(false);
                        res.data[1] === "success" &&
                          navigate(`/${writingInfo.userUID}`);
                        setTimeout(() => {
                          setAlarm(["", "success", false]);
                        }, 3000);
                      });
                  }}
                  disabled={deleteInput !== writingInfo.title}
                  className={`border px-2 py-2 text-center rounded-full text-sm ${
                    deleteInput === writingInfo.title && "text-red-500"
                  } `}
                >
                  ??????
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Delete div */}
      <div className="flex flex-col items-start w-1/3 GalaxyS20Ultra:w-full">
        <div className="flex flex-col">
          <span className="text-2xl font-bold mb-10">??? ??????</span>
          <button
            className={`text-md font-bold border border-writingSettingBorder py-2 px-3 rounded-full hover:bg-writingSettingHoverBG ${
              disclosure === "PUBLIC" && "bg-genreSelectedBG"
            }`}
            onClick={() => {
              setDeleteModalOpen(true);
            }}
          >
            ?????? ??????
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingSetting;
