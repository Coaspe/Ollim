import { motion } from "framer-motion";
import { memo, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/user";
import { removeAlarm } from "../services/firebase";
import { getFirestoreAlarmType, totalAlarmType } from "../type";
import axios from "axios";
import { alarmNavigator } from "../helpers/alarm-navigator";
import AlarmContent from "./AlarmContent";

interface props {
  data: getFirestoreAlarmType;
  identity: string;
  setAlarmMap: React.Dispatch<
    React.SetStateAction<Map<string, getFirestoreAlarmType>>
  >;
  setUnConfirmedAlarms: React.Dispatch<
    React.SetStateAction<Map<string, getFirestoreAlarmType>>
  >;
}
const AlarmRow: React.FC<props> = ({
  data,
  identity,
  setAlarmMap,
  setUnConfirmedAlarms,
}) => {
  const { user } = useContext(UserContext);
  const [info, setInfo] = useState<totalAlarmType>(data.info as totalAlarmType);
  const navigator = useNavigate();
  useEffect(() => {
    console.log(info, data.category);
  }, [info]);
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
        setUnConfirmedAlarms((origin) => {
          const tmp = new Map(origin);
          tmp.delete(identity);
          return tmp;
        });
        axios
          .post("https://ollim.herokuapp.com/makeAlarmSeen", {
            alarmKey: identity,
            userUID: user.uid,
          })
          .then(() => {
            alarmNavigator(info, data.category, navigator);
          });
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
          if (!data.seen) {
            setUnConfirmedAlarms((origin) => {
              const tmp = new Map(origin);
              tmp.delete(identity);
              return tmp;
            });
          }
          setAlarmMap((origin) => {
            const tmp = new Map(origin);
            tmp.delete(identity);
            return tmp;
          });
          removeAlarm(identity, user.uid);
        }}
        className="material-icons absolute top-0.5 right-0.5 text-sm text-gray-500"
      >
        close
      </span>
      <span className="material-icons">chat</span>
      <div className="h-full border-l border-l-gray-300 mx-3" />
      <div className="flex flex-col text-sm h-full">
        <AlarmContent info={info} category={data.category} />
      </div>
    </motion.div>
  );
};

export default memo(AlarmRow);
