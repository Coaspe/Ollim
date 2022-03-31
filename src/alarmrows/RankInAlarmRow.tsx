import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/user";
import { removeAlarm } from "../services/firebase";
import { alarmRankInInfo, getFirestoreAlarmType } from "../type";
interface props {
  data: getFirestoreAlarmType;
  index: number;
  setAlarmValues: React.Dispatch<React.SetStateAction<getFirestoreAlarmType[]>>;
  setAlarmKeys: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setUnConfirmedAlarms: React.Dispatch<React.SetStateAction<string[]>>;
}
const RankInAlarmRow: React.FC<props> = ({
  data,
  index,
  setAlarmValues,
  setAlarmKeys,
  setUnConfirmedAlarms,
}) => {
  const { user } = useContext(UserContext);
  const navigator = useNavigate();
  const [info, setInfo] = useState(data.info as alarmRankInInfo);

  return (
    <AnimatePresence>
      <motion.div
        layout
        animate={{
          opacity: [0, 1],
        }}
        whileHover={{ backgroundColor: "#eee" }}
        transition={{ type: "ease" }}
        className="relative flex border rounded-md px-3 py-3 items-center w-full h-fit"
        onClick={(e) => {
          e.stopPropagation();
          axios
            .post("https://ollim.herokuapp.com/makeAlarmSeen", {
              alarmKey: `${data.dateCreated}_RANKIN_${info.rankedInWritingTitle}_${user.uid}`,
              userUID: user.uid,
            })
            .then(() => {
              setAlarmValues((origin) => {
                let tmp = origin.slice();
                tmp[index] = { ...tmp[index], seen: true };
                return tmp;
              });
              setUnConfirmedAlarms((origin) => {
                const tmp = origin.slice();
                tmp.splice(tmp.indexOf(data.key), 1);
                return tmp;
              });
            });
          navigator("/community");
        }}
      >
        <div
          className={`absolute top-1 left-1 w-1.5 h-1.5 rounded-full ${
            data.seen ? "bg-gray-500" : "bg-red-500"
          }`}
        />
        <span
          onClick={(e) => {
            e.stopPropagation();
            removeAlarm(
              `${data.dateCreated}_RANKIN_${info.rankedInWritingTitle}_${user.uid}`,
              user.uid
            ).then(() => {
              setAlarmValues((origin) => {
                const returnValue = origin.slice();
                returnValue.splice(index, 1);
                return returnValue;
              });
              if (!data.seen) {
                setUnConfirmedAlarms((origin) => {
                  const tmp = origin.slice();
                  tmp.splice(tmp.indexOf(data.key), 1);
                  return tmp;
                });
              }
              setAlarmKeys((origin) => {
                const tmp = origin.slice();
                tmp.splice(index, 1);
                return tmp;
              });
            });
          }}
          className="material-icons absolute top-0.5 right-0.5 text-sm text-gray-500"
        >
          close
        </span>
        <span className="material-icons">chat</span>
        <div className="h-full border-l border-l-gray-300 mx-3" />
        <div className="flex flex-fol h-full">
          <span className="text-sm font-bold">{info.rankedInWritingTitle}</span>
          {info.type === "NEW" && (
            <span className="text-sm">작가님의 작품이 랭크에 올라갔습니다</span>
          )}
          {info.type === "THIRDTOSECOND" && (
            <span className="text-sm">
              작가님의 작품이 3등에서 2등이 되었습니다
            </span>
          )}
          {info.type === "THIRDTOFIRST" && (
            <span className="text-sm">
              작가님의 작품이 3등에서 1등이 되었습니다
            </span>
          )}
          {info.type === "SECONDTOFIRST" && (
            <span className="text-sm">
              작가님의 작품이 2등에서 1등이 되었습니다
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(RankInAlarmRow);
