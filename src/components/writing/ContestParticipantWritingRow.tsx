import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { participateContest } from "../../services/firebase";
import {
  contestWriting,
  genre,
  getFirestoreContest,
  getFirestoreWriting,
} from "../../type";
import { expandVariants, genreMatching, partiVariants } from "../../constants";
interface props {
  data: getFirestoreWriting;
  contestInfo: getFirestoreContest;
  setContestInfo: React.Dispatch<React.SetStateAction<getFirestoreContest>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const ContestParticipantWritingRow: React.FC<props> = ({
  data,
  contestInfo,
  setContestInfo,
  setOpen,
}) => {
  // Make submit button visible state
  const [btnVisible, setBtnVisible] = useState(false);
  const [expand, setExpand] = useState(false);

  const handleSubmit = async (
    idx: number = -1,
    collectionTitle: string = ""
  ) => {
    if (new Date().getTime() <= new Date(contestInfo.deadline).getTime()) {
      try {
        let newDocID: string = await participateContest(
          contestInfo.contestDocID,
          data,
          idx + 1
        );
        const update: contestWriting = {
          title: data.title,
          updateDate: new Date().getTime(),
          synopsis: data.synopsis,
          writingDocID: newDocID,
          collectionTitle,
          vote: 0,
          userUID: data.userUID,
        };
        let tmp = Object.assign({}, contestInfo);
        tmp.writings[data.userUID] = update;
        setContestInfo(tmp);
        setOpen(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      //
    }
  };

  return (
    <motion.div
      layout
      onClick={(e) => {
        e.stopPropagation();
        if (data.isCollection) {
          setExpand((origin) => !origin);
        }
      }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => {
        setBtnVisible(true);
      }}
      onHoverEnd={() => {
        setBtnVisible(false);
      }}
      className={`flex items-center border border-logoBrown border-opacity-50 rounded-xl relative w-full`}
    >
      <div className="w-full relative flex flex-col text-noto cursor-pointer py-3 px-3 z-0">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center">
            <span className="text-lg font-black">{data.title}</span>
          </div>
          <div>
            <AnimatePresence>
              {btnVisible ? (
                data.isCollection ? (
                  <motion.span
                    initial={expand ? "open" : "collapsed"}
                    animate={expand ? "open" : "collapsed"}
                    variants={expandVariants}
                    className="material-icons cursor-pointer w-5"
                  >
                    expand_more
                  </motion.span>
                ) : (
                  <motion.svg
                    onClick={() => {
                      handleSubmit();
                    }}
                    className="cursor-pointer  w-5 "
                    x="0px"
                    y="0px"
                    viewBox="0 0 512 512"
                  >
                    <motion.path
                      d="M256,0C114.84,0,0,114.842,0,256s114.84,256,256,256s256-114.842,256-256S397.16,0,256,0z M256,462.452
            c-113.837,0-206.452-92.614-206.452-206.452S142.163,49.548,256,49.548S462.452,142.163,462.452,256S369.837,462.452,256,462.452z
            "
                    />
                    <motion.polygon points="345.838,164.16 222.968,287.029 157.904,221.967 122.87,257.001 222.968,357.1 380.872,199.194 		" />
                  </motion.svg>
                )
              ) : (
                <span className="text-sm text-gray-700 font-black ml-3">
                  {genreMatching[data.genre as genre]}
                </span>
              )}
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {expand && (
            <motion.div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="px-2 flex flex-col"
              variants={partiVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {Object.values(data.collection).map((val, idx) => (
                <motion.span
                  onClick={() => {
                    handleSubmit(idx + 1, val.title);
                  }}
                  className="w-full cursor-pointer"
                  key={idx}
                >
                  {idx + 1}. {val.title}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ContestParticipantWritingRow;
