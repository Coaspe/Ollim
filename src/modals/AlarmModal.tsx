import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import SpinningSvg from "../components/SpinningSvg";
import UserContext from "../context/user";
import { getFirestoreAlarmType } from "../type";
import AlarmRow from "../components/alarmrows/AlarmRow";
import { removeAllAlarms } from "../services/firebase";

interface props {
  open: boolean;
  alarmMap: Map<string, getFirestoreAlarmType>;
  setAlarmMap: React.Dispatch<
    React.SetStateAction<Map<string, getFirestoreAlarmType>>
  >;
  setUnConfirmedAlarms: React.Dispatch<
    React.SetStateAction<number>
  >;
}
const AlarmModal: React.FC<props> = ({
  open,
  alarmMap,
  setAlarmMap,
  setUnConfirmedAlarms,
}) => {
  const [removeAllBtnDisable, setRemoveAllBtnDisable] = useState(false);
  const [confirmAllBtnDisable, setComfirmAllBtnDisable] = useState(false);
  const { user } = useContext(UserContext);

  const handleMakeAllAlarmsConfirm = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setComfirmAllBtnDisable(true);
    e.stopPropagation();
    if (setUnConfirmedAlarms.length !== 0) {
      axios
        .post("https://ollim.onrender.com/makeAllAlarmsSeen", {
          alarmKeys: JSON.stringify(Array.from(alarmMap.keys())),
          userUID: user.uid,
        })
        .then(() => {
          setComfirmAllBtnDisable(false);
          setAlarmMap((origin) => {
            let tmp = new Map(origin);
            origin.forEach((data, key) => {
              let tempVal = data;
              tempVal.seen = true;
              tmp.set(key, tempVal);
            });
            return tmp;
          });
          setUnConfirmedAlarms(0);
        });
    }
  };

  const handleRemoveAllAlarms = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setRemoveAllBtnDisable(true);
    e.stopPropagation();
    if (alarmMap.size > 0) {
      removeAllAlarms(user.uid)
      setAlarmMap(new Map());
      setUnConfirmedAlarms(0);
      setRemoveAllBtnDisable(false);
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
                onClick={handleMakeAllAlarmsConfirm}
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

          {Array.from(alarmMap.entries()).map(([key, value]) => (
            <AlarmRow
              key={key}
              identity={key}
              data={value}
              setAlarmMap={setAlarmMap}
              setUnConfirmedAlarms={setUnConfirmedAlarms}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlarmModal;
