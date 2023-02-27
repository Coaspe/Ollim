import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VoteComfirmModal from "../modals/VoteConfirmModal";
import { getUserByUID } from "../../services/firebase";
import { contestWriting, getFirestoreUser } from "../../type";
interface props {
  data: contestWriting;
  medal?: string;
  widthSize: number;
  handleOnClick: (selectedWritingDocID: string) => void;
  contestDocID: string;
  contextUserUID: string;
  deadline: string;
  userVote: string;
  setUserVote: React.Dispatch<React.SetStateAction<string>>;
}
const ContestWriting: React.FC<props> = ({
  data,
  widthSize,
  handleOnClick,
  contestDocID,
  contextUserUID,
  deadline,
  userVote,
  setUserVote,
}) => {
  const [voteConfirmModalOpen, setVoteConfirmModalOpen] = useState(false);
  const [writingOwnerInfo, setWritingOwnerInfo] = useState<getFirestoreUser>(
    {} as getFirestoreUser
  );
  const navigator = useNavigate();
  useEffect(() => {
    const getWritingOwnerInfo = async () => {
      const userInfo = await getUserByUID(data.userUID);
      setWritingOwnerInfo(userInfo);
    };
    data.userUID && getWritingOwnerInfo();
  }, [data.userUID]);

  return (
    <>
      <AnimatePresence>
        {voteConfirmModalOpen && (
          <VoteComfirmModal
            data={data}
            contextUserUID={contextUserUID}
            contestDocID={contestDocID}
            setVoteConfirmModalOpen={setVoteConfirmModalOpen}
            setUserVote={setUserVote}
          />
        )}
      </AnimatePresence>

      {Object.keys(writingOwnerInfo).length > 0 && (
        <motion.div
          layout
          animate={{ opacity: [0, 1] }}
          onClick={() => {
            handleOnClick(data.writingDocID);
          }}
          style={{ maxWidth: "350px" }}
          className="relative w-full h-full group"
        >
          {new Date(deadline).getTime() >= new Date().getTime() &&
            (!userVote ? (
              <motion.span
                whileHover={{
                  color: "#905C4C",
                  transition: {
                    duration: 0.2,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setVoteConfirmModalOpen(true);
                }}
                className={`z-10 material-icons cursor-pointer absolute top-2 right-2 invisible group-hover:visible`}
              >
                how_to_vote
              </motion.span>
            ) : (
              userVote === data.writingDocID && (
                <span
                  style={{ color: "#905C4C" }}
                  className={`z-10 material-icons cursor-pointer absolute top-2 right-2`}
                >
                  how_to_vote
                </span>
              )
            ))}

          <motion.div className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-5 z-0">
            <motion.img
              style={{ filter: "grayscale(100%)" }}
              whileHover={{
                filter: "grayscale(0%)",
                transition: {
                  duration: 0.3,
                },
              }}
              onClick={() => {
                navigator(`/${data.userUID}`);
              }}
              className="w-7 h-7 object-cover rounded-full absolute bottom-2 right-2 shadow-lg z-10"
              src={writingOwnerInfo.profileImg}
              alt="profile"
            />
            <div className="mb-3 flex items-center justify-between GalaxyS20Ultra:flex-col">
              <div className="flex w-full items-center space-x-3">
                <span className="text-xl font-black GalaxyS20Ultra:text-sm">
                  {data.title}
                </span>
                {data.collectionTitle && (
                  <span>{` - ${data.collectionTitle}`}</span>
                )}
              </div>
            </div>
            {widthSize > 500 && (
              <motion.textarea
                value={data.synopsis}
                readOnly
                className="text-sm text-gray-400 mb-3 font-semibold bg-transparent resize-none overflow-hidden pointer-events-none"
              >
                {data.synopsis}
              </motion.textarea>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default memo(ContestWriting);
