import { motion } from "framer-motion";
import { vote } from "../../services/firebase";
import { contestWriting } from "../../type";

interface props {
  data: contestWriting;
  contestDocID: string;
  contextUserUID: string;
  setVoteConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserVote: React.Dispatch<React.SetStateAction<string>>;
}
const VoteComfirmModal: React.FC<props> = ({
  data,
  contextUserUID,
  contestDocID,
  setVoteConfirmModalOpen,
  setUserVote,
}) => {
  const handleModalClose = () => {
    setVoteConfirmModalOpen(false);
  };
  const handleVote = () => {
    vote(contestDocID, contextUserUID, data.userUID, data.writingDocID).then(
      () => {
        setUserVote(data.writingDocID);
      }
    );
    handleModalClose();
  };
  return (
    <motion.div
      className="font-noto flex items-center justify-center z-20 fixed w-full h-full top-0 right-0"
      animate={{
        backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"],
      }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <motion.div
        animate={{
          scale: ["90%", "100%"],
          opacity: ["0%", "100%"],
        }}
        transition={{
          duration: 0.2,
          type: "spring",
        }}
        style={{ backgroundColor: "#faf6f5", maxHeight: "300px" }}
        className="relative w-1/4 h-1/4 flex flex-col items-center justify-center rounded-xl"
      >
        <div className="flex flex-col items-center justify-between h-full py-5">
          <span className="text-2xl font-bold">투표</span>
          <div className="flex flex-col space-y-2">
            <span>신중히 선택해 주세요! 투표 결과는 수정하지 못합니다.</span>
            <span>
              <span className="text-xl font-bold">{data.title}</span>
              <span>에 투표하시겠습니까?</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <motion.span
              onClick={handleVote}
              whileHover={{ color: "#49b675" }}
              style={{ fontSize: "2rem" }}
              className="material-symbols-outlined cursor-pointer "
            >
              check_circle
            </motion.span>
            <motion.span
              onClick={handleModalClose}
              whileHover={{ color: "#EF4444" }}
              style={{ fontSize: "2rem" }}
              className="material-symbols-outlined cursor-pointer "
            >
              cancel
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VoteComfirmModal;
