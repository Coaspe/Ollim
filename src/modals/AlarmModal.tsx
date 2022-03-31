import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import AddCommentAlarmRow from "../alarmrows/AddCommentAlarmRow";
import AddWritingAlarmRow from "../alarmrows/AddWritingAlarmRow";
import FollowingAlarmRow from "../alarmrows/FollowingAlarmRow";
import RankInAlarmRow from "../alarmrows/RankInAlarmRow";
import SpinningSvg from "../components/SpinningSvg";
import UserContext from "../context/user";
import { getFirestoreAlarmType } from "../type";
interface props {
  alarmValues: getFirestoreAlarmType[];
  setAlarmValues: React.Dispatch<React.SetStateAction<getFirestoreAlarmType[]>>;
  setAlarmKeys: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  alarmKeys: (string | null)[];
  open: boolean;
  setUnConfirmedAlarms: React.Dispatch<React.SetStateAction<string[]>>;
}
const AlarmModal: React.FC<props> = ({
  alarmValues,
  setAlarmValues,
  setAlarmKeys,
  alarmKeys,
  open,
  setUnConfirmedAlarms,
}) => {
  const [removeAllBtnDisable, setRemoveAllBtnDisable] = useState(false);
  const [confirmAllBtnDisable, setComfirmAllBtnDisable] = useState(false);
  const { user } = useContext(UserContext);
  const handleMakeAllAlarmsSeen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setComfirmAllBtnDisable(true);
    e.stopPropagation();
    if (setUnConfirmedAlarms.length !== 0) {
      axios
        .post("https://ollim.herokuapp.com/makeAllAlarmsSeen", {
          alarmKeys: JSON.stringify(alarmKeys),
          userUID: user.uid,
        })
        .then(() => {
          setComfirmAllBtnDisable(false);
          setAlarmValues((origin) => {
            return origin.map((value) => {
              let tmp = Object.assign({}, value);
              tmp.seen = true;
              return tmp;
            });
          });
          setUnConfirmedAlarms([]);
        });
    }
  };
  const handleRemoveAllAlarms = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setRemoveAllBtnDisable(true);
    e.stopPropagation();
    if (alarmValues.length > 0) {
      axios.post("https://ollim.herokuapp.com/removeAllAlarms", {
        alarmKeys: JSON.stringify(alarmKeys),
        userUID: user.uid,
      });
      setTimeout(() => {
        setAlarmValues([]);
        setAlarmKeys([]);
        setUnConfirmedAlarms([]);
        setRemoveAllBtnDisable(false);
      }, 1000);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          layout
          onClick={(e) => {
            e.stopPropagation();
          }}
          initial={{ opacity: 0, y: "-3%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "-3%" }}
          transition={{ duration: 0.2 }}
          className="select-none w-72 h-72 px-3 py-5 border flex flex-col items-center space-y-3 absolute overflow-y-scroll bg-white -left-60 top-10 "
        >
          <div style={{ fontSize: "0.7rem" }} className="flex items-center">
            {!confirmAllBtnDisable ? (
              <motion.button
                whileHover={{ backgroundColor: "#aaa" }}
                onClick={handleMakeAllAlarmsSeen}
                className="mr-3 rounded-2xl px-2 py-1 border"
              >
                모두 읽음 표시
              </motion.button>
            ) : (
              <SpinningSvg />
            )}
            {!removeAllBtnDisable ? (
              <motion.button
                whileHover={{ backgroundColor: "#aaa" }}
                onClick={handleRemoveAllAlarms}
                className="rounded-2xl px-2 py-1 border"
              >
                모두 삭제
              </motion.button>
            ) : (
              <SpinningSvg />
            )}
          </div>

          {alarmValues.map((data, index) => {
            if (data.category === "ADDCOMMENT") {
              return (
                <AddCommentAlarmRow
                  key={`${index}_ADDCOMMENT`}
                  data={data}
                  index={index}
                  setAlarmValues={setAlarmValues}
                  setAlarmKeys={setAlarmKeys}
                  setUnConfirmedAlarms={setUnConfirmedAlarms}
                />
              );
            } else if (data.category === "FOLLOWING") {
              return (
                <FollowingAlarmRow
                  key={`${index}_FOLLOWING`}
                  data={data}
                  index={index}
                  setAlarmValues={setAlarmValues}
                  setAlarmKeys={setAlarmKeys}
                  setUnConfirmedAlarms={setUnConfirmedAlarms}
                />
              );
            } else if (data.category === "RANKIN") {
              <RankInAlarmRow
                key={`${index}_RANKIN`}
                data={data}
                index={index}
                setAlarmValues={setAlarmValues}
                setAlarmKeys={setAlarmKeys}
                setUnConfirmedAlarms={setUnConfirmedAlarms}
              />;
            } else {
              return (
                <AddWritingAlarmRow
                  key={`${index}_NEWWRITING`}
                  data={data}
                  index={index}
                  setAlarmValues={setAlarmValues}
                />
              );
            }
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlarmModal;
