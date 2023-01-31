import { motion } from "framer-motion";
import { memo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/user";
import { makeAlarmSeen, removeAlarm } from "../../services/firebase";
import { getFirestoreAlarmType, totalAlarmType } from "../../type";
import { alarmNavigator } from "../../helpers/alarm-navigator";
import AlarmContent from "./AlarmContent";

interface props {
  data: getFirestoreAlarmType;
  identity: string;
  setAlarmMap: React.Dispatch<
    React.SetStateAction<Map<string, getFirestoreAlarmType>>
  >;
  setUnConfirmedAlarms: React.Dispatch<
    React.SetStateAction<number>
  >;
}
const AlarmRow: React.FC<props> = ({
  data,
  identity,
  setAlarmMap,
  setUnConfirmedAlarms,
}) => {
  const { user } = useContext(UserContext);
  const [alarmData, setAlarmData] = useState<getFirestoreAlarmType>(data)
  const navigator = useNavigate();

  const handleClickAlarm = async (e: any) => {
    e.stopPropagation();
    setUnConfirmedAlarms((origin) => {
      return origin - 1 >= 0 ? origin - 1 : 0;
    });
    await makeAlarmSeen(identity, user.uid)
    setAlarmData(() => {
      data.seen = true
      return data
    })
    // Move page with alarm info.
    alarmNavigator(alarmData.info, data.category, navigator);
  }

  const handleRemoveAlarm = (e: any) => {
    e.stopPropagation();
    if (!data.seen) {
      setUnConfirmedAlarms((origin) => {
        return origin - 1 >= 0 ? origin - 1 : 0;
      });
    }
    setAlarmMap((origin) => {
      const tmp = new Map(origin);
      tmp.delete(identity);
      return tmp;
    });
    removeAlarm(identity, user.uid);
  }
  return (
    <motion.div
      layout
      animate={{
        opacity: [0, 1],
      }}
      whileHover={{ backgroundColor: "#eee" }}
      transition={{ type: "ease" }}
      className="relative flex border rounded-md px-3 py-3 items-center w-full h-fit"
      onClick={handleClickAlarm}
    >
      <div
        className={`absolute top-1 left-1 w-1.5 h-1.5 rounded-full ${alarmData.seen ? "bg-gray-500" : "bg-red-500"
          }`}
      />
      {/* Remove alarm botton */}
      <span
        onClick={handleRemoveAlarm}
        className="material-icons absolute top-0.5 right-0.5 text-sm text-gray-500"
      >
        close
      </span>
      <span className="material-icons">chat</span>
      <div className="h-full border-l border-l-gray-300 mx-3" />
      <div className="flex flex-col text-sm h-full">
        <AlarmContent info={alarmData.info} category={data.category} />
      </div>
    </motion.div>
  );
};

export default memo(AlarmRow);
