import { motion } from "framer-motion";
import { memo, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/user";
import { removeAlarm } from "../services/firebase";
import { alarmAddWritingInfo, getFirestoreAlarmType } from "../type";
interface props {
  data: getFirestoreAlarmType;
  index: number;
  setAlarmValues: React.Dispatch<React.SetStateAction<any[]>>;
}
const AddWritingAlarmRow: React.FC<props> = ({
  data,
  index,
  setAlarmValues,
}) => {
  const { user } = useContext(UserContext);
  const [info, setInfo] = useState<alarmAddWritingInfo>(
    data.info as alarmAddWritingInfo
  );
  const navigator = useNavigate();
  return (
    <motion.div
      layout
      whileHover={{ backgroundColor: "#eee" }}
      transition={{ type: "ease" }}
      className="relative flex border rounded-md px-3 py-3 items-center justify-center w-full h-fit"
      onClick={() => {
        navigator(`/writings/${info.writingOwnerUID}/${info.writingDocID}`);
      }}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          removeAlarm(
            `${data.dateCreated}_FOLLOWING_${info.writingOwnerUID}`,
            user.uid
          ).then(() => {
            setAlarmValues((origin) => {
              const returnValue = origin.slice();
              returnValue.splice(index, 1);
              return returnValue;
            });
          });
        }}
        className="material-icons absolute top-0.5 right-0.5 text-sm text-gray-500"
      >
        close
      </span>
      <span className="material-icons">post_add</span>
      <div className="h-full border-l border-l-gray-300 mx-3" />
      <span className="text-sm font-bold">
        {info.writingOwnerUsername}
        <span className="font-normal"> 님이 새 글을 작성하였습니다.</span>
      </span>
    </motion.div>
  );
};

export default memo(AddWritingAlarmRow);
