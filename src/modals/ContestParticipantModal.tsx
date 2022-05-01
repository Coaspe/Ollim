import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import useGetGenreWritings from "../hooks/useGetGenreWritings";
import { contestWriting, gerneType } from "../type";
import ContestParticipantWritingRow from "../writingRows/ContestParticipantWritingRow";

interface props {
  uid: string;
  genre: gerneType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contestDocID: string;
  setSubmittedWriting: React.Dispatch<React.SetStateAction<contestWriting>>;
  deadline: string;
}
const ContestParticipantModal: React.FC<props> = ({
  uid,
  genre,
  open,
  setOpen,
  contestDocID,
  setSubmittedWriting,
  deadline,
}) => {
  // Context User's writings lists that fits the genre
  const writingsInfo = useGetGenreWritings(uid, genre);
  // Search input Opened state and value and searched writings
  const [inputOpened, setInputOpened] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchedWritings, setSearchedWritings] = useState(writingsInfo);

  useEffect(() => {
    setSearchedWritings(writingsInfo);
  }, [writingsInfo]);
  // Search input changed function
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      let tmp = writingsInfo.filter((writing) => writing.title.includes(value));
      setSearchedWritings(tmp);
    } else {
      setSearchedWritings(writingsInfo);
    }
  };
  return (
    <AnimatePresence>
      {writingsInfo && open && (
        <motion.div
          animate={{
            backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
          }}
          transition={{ duration: 0.2 }}
          style={{ zIndex: 10000 }}
          className="font-noto fixed w-full h-full items-center justify-center top-0 left-0 flex"
          onClick={() => {
            setOpen(false);
          }}
        >
          <motion.div
            style={{ minWidth: "400px" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            animate={{
              scale: ["80%", "100%"],
              opacity: ["0%", "100%"],
            }}
            transition={{
              duration: 0.2,
              type: "spring",
            }}
            className="flex flex-col items-center w-1/4 h-1/2 bg-white py-5 rounded-lg GalaxyS20Ultra:w-4/5"
          >
            <div className="grid grid-cols-5 w-full px-10 items-center">
              <div className="text-lg font-bold text-gray-500 col-start-2 col-span-3 justify-self-center">
                <AnimatePresence>
                  {!inputOpened ? (
                    <span className="inline-block w-full px-2 py-1">
                      제출 선택
                    </span>
                  ) : (
                    <motion.input
                      animate={{ scaleX: ["0%", "100%"] }}
                      transition={{
                        duration: 0.2,
                        type: "spring",
                        bounce: 0.5,
                      }}
                      className="w-full border border-gray-400 rounded px-2 py-1 focus:outline-none"
                      autoFocus
                      type="text"
                      value={inputValue}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onChange={onInputChange}
                    />
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-center">
                <motion.span
                  onClick={(e) => {
                    e.stopPropagation();
                    setInputOpened((origin) => !origin);
                  }}
                  whileHover={{ backgroundColor: "rgb(209 213 219)" }}
                  transition={{ ease: "linear" }}
                  className={`px-1 py-1 rounded-full cursor-pointer material-icons justify-self-end font-bold text-gray-500 ${
                    inputOpened && "text-black"
                  }`}
                >
                  search
                </motion.span>
              </div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="overflow-y-scroll flex flex-col items-center w-full h-full px-10 py-5 gap-3 overflow-y-scrolll"
            >
              {searchedWritings.map((data) => (
                <ContestParticipantWritingRow
                  contestDocID={contestDocID as string}
                  key={data.writingDocID}
                  data={data}
                  setSubmittedWriting={setSubmittedWriting}
                  deadline={deadline}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContestParticipantModal;
