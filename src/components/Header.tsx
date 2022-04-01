import { Tooltip } from "@mui/material";
import { get, limitToLast, onChildAdded, query, ref } from "firebase/database";
import { motion, useAnimation } from "framer-motion";
import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rtDBRef } from "../lib/firebase";
import AlarmModal from "../modals/AlarmModal";
import { getFirestoreAlarmType, getFirestoreUser } from "../type";

interface props {
  userInfo: getFirestoreUser;
}

const Header: React.FC<props> = ({ userInfo }) => {
  const controls = useAnimation();
  const navigator = useNavigate();

  const [unConfirmedAlarms, setUnConfirmedAlarms] = useState<string[]>([]);
  const [alarmValues, setAlarmValues] = useState<getFirestoreAlarmType[]>([]);
  const [alarmKeys, setAlarmKeys] = useState<(string | null)[]>([]);
  const [alarmModalOpen, setAlarmModalOpen] = useState(false);

  useEffect(() => {
    if (userInfo.uid) {
      get(ref(rtDBRef, "alarms/" + userInfo.uid)).then((snapshot) => {
        if (snapshot.exists()) {
          const snap = snapshot.val();
          const keys = Object.keys(snap);
          const values = Object.values(snap).map((data: any, index) => ({
            ...data,
            key: keys[index],
          }));
          const unConfirmedTmp: string[] = [];

          values.forEach((data: any, index) => {
            if (!data.seen) {
              unConfirmedTmp.push(keys[index]);
            }
          });
          setUnConfirmedAlarms(unConfirmedTmp);
          setAlarmKeys(keys);
          setAlarmValues(
            values.sort((a: any, b: any) => b.dateCreated - a.dateCreated)
          );
        }
      });
    }
  }, [userInfo.uid]);

  useEffect(() => {
    const q = query(ref(rtDBRef, "alarms/" + userInfo.uid), limitToLast(1));
    onChildAdded(q, (onChildAddedSnapshot) => {
      if (onChildAddedSnapshot.exists()) {
        setUnConfirmedAlarms((originComfirmed) => {
          if (!originComfirmed.includes(onChildAddedSnapshot.key as string)) {
            let tmp = originComfirmed.slice();
            tmp.push(onChildAddedSnapshot.key as string);
            return tmp;
          }
          return originComfirmed;
        });
        setAlarmKeys((originKeys) => {
          if (!originKeys.includes(onChildAddedSnapshot.key as string)) {
            controls.start({
              fill: "#d84742",
              y: ["0%", "-30%", "0%", "0%", "-30%", "0%"],
            });
            return [onChildAddedSnapshot.key, ...originKeys];
          }
          return originKeys;
        });
        setAlarmValues((originValues) => {
          let tmp: string[] = [];
          originValues.forEach((data) => {
            tmp.push(data.key);
          });
          if (!tmp.includes(onChildAddedSnapshot.key as string)) {
            return [
              {
                ...onChildAddedSnapshot.val(),
                key: onChildAddedSnapshot.key,
              },
              ...originValues,
            ];
          }
          return originValues;
        });
      }
    });
  }, []);

  const handleAlarmModalOpen = (e: any) => {
    e.stopPropagation();
    setAlarmModalOpen((origin) => !origin);
  };

  return (
    <div className="select-none flex w-full items-center justify-between px-20 GalaxyS20Ultra:px-10 GalaxyS20Ultra:my-5">
      {/* logo */}
      <img
        onClick={() => {
          userInfo.uid
            ? navigator(`/${userInfo.uid}`)
            : navigator("/community");
        }}
        className="h-28 cursor-pointer GalaxyS20Ultra:h-16"
        src="/logo/Ollim-logos_transparent.png"
        alt="header logo"
      />
      {userInfo.uid ? (
        <div className="flex items-center cursor-pointer px-4 py-2 rounded-3xl space-x-2 GalaxyS20Ultra:p-0 GalaxyS20Ultra:h-0">
          <img
            onClick={() => {
              navigator(`/${userInfo.uid}`);
            }}
            src={userInfo.profileImg}
            className="w-7 rounded-full"
            alt="user profile"
          />
          <span
            onClick={() => {
              navigator(`/${userInfo.uid}`);
            }}
            className="GalaxyS20Ultra:invisible GalaxyS20Ultra:w-0"
          >
            {userInfo.username}
          </span>
          <div className="relative" style={{ zIndex: 1000 }}>
            <Tooltip title={unConfirmedAlarms.length} placement="top" arrow>
              <motion.svg
                fill={unConfirmedAlarms.length === 0 ? "#555" : "#d84742"}
                key={unConfirmedAlarms.length}
                animate={controls}
                className={`w-5 ${
                  unConfirmedAlarms.length > 0 && "animate-pulse"
                }`}
                x="0px"
                y="0px"
                viewBox="0 0 320 320"
                onClick={handleAlarmModalOpen}
              >
                <motion.path
                  d="M160,0c-8.284,0-15,6.717-15,15v10.344c-50.816,7.301-90,51.118-90,103.923V260h-5
                  c-8.284,0-15,6.717-15,15c0,8.285,6.716,15,15,15h67.58c6.192,17.459,22.865,30,42.42,30s36.227-12.541,42.42-30H270
                  c8.284,0,15-6.715,15-15c0-8.283-6.716-15-15-15h-5V129.267c0-52.805-39.184-96.622-90-103.923V15C175,6.717,168.284,0,160,0z"
                />
              </motion.svg>
            </Tooltip>
            <AlarmModal
              key="alarmModal"
              alarmValues={alarmValues}
              open={alarmModalOpen}
              alarmKeys={alarmKeys}
              setAlarmValues={setAlarmValues}
              setUnConfirmedAlarms={setUnConfirmedAlarms}
              setAlarmKeys={setAlarmKeys}
            />
          </div>
        </div>
      ) : (
        <div>
          <svg
            onClick={() => {
              navigator("/");
            }}
            className="w-7 cursor-pointer"
            x="0px"
            y="0px"
            viewBox="0 0 481.5 481.5"
          >
            <g>
              <g>
                <path
                  d="M0,240.7c0,7.5,6,13.5,13.5,13.5h326.1l-69.9,69.9c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l93-93
                            c5.3-5.3,5.3-13.8,0-19.1l-93-93c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l69.9,69.9h-326C6,227.2,0,233.2,0,240.7z"
                />
                <path
                  d="M382.4,0H99C44.4,0,0,44.4,0,99v58.2c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V99c0-39.7,32.3-72,72-72h283.5
                            c39.7,0,72,32.3,72,72v283.5c0,39.7-32.3,72-72,72H99c-39.7,0-72-32.3-72-72V325c0-7.5-6-13.5-13.5-13.5S0,317.5,0,325v57.5
                            c0,54.6,44.4,99,99,99h283.5c54.6,0,99-44.4,99-99V99C481.4,44.4,437,0,382.4,0z"
                />
              </g>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default memo(Header);
