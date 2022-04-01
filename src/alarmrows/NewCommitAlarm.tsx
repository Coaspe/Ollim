import { motion } from "framer-motion";
import { memo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/user";
import { removeAlarm } from "../services/firebase";
import { alarmNewCommit, getFirestoreAlarmType } from "../type";
import axios from "axios";

interface props {
  data: getFirestoreAlarmType;
  index: number;
  setAlarmValues: React.Dispatch<React.SetStateAction<any[]>>;
  setAlarmKeys: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setUnConfirmedAlarms: React.Dispatch<React.SetStateAction<string[]>>;
}
const NewCommitAlarm: React.FC<props> = ({
  data,
  index,
  setAlarmValues,
  setAlarmKeys,
  setUnConfirmedAlarms,
}) => {
  const { user } = useContext(UserContext);
  const [info, setInfo] = useState<alarmNewCommit>(data.info as alarmNewCommit);
  const navigator = useNavigate();
  return (
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
            alarmKey: `${data.dateCreated}_NEWCOMMIT_${info.writingDocID}`,
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
        navigator(`/writings/${info.writingOwnerUID}/${info.writingDocID}`);
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
            `${data.dateCreated}_NEWCOMMIT_${info.writingDocID}`,
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
      <div className="flex flex-col text-sm">
        <span className="font-bold">{info.writingOwnerUsername}</span>
        <span className="text-gray-500 font-bold">{info.writingTitle}</span>
        <span style={{ fontSize: "0.7rem" }}>새로운 제출이 있습니다</span>
      </div>
    </motion.div>
  );
};

export default memo(NewCommitAlarm);
