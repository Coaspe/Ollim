import { Tooltip } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { motion } from "framer-motion";
import { memo } from "react";
import { bgColor } from "../../constants";
import { bgColorType } from "../../type";
interface props {
  date: string;
  elementCommits: { [key: number]: string[] };
}

// Display 1 day calendar node.
const CalendarElementNode: React.FC<props> = ({ date, elementCommits }) => {
  return (
    <>
      {elementCommits[parseInt(date)].length > 0 ? (
        <Tooltip
          title={`${parseInt(date)}일 ${`- ${elementCommits[parseInt(date)]}`}`}
          placement="top"
          arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 300 }}
        >
          <motion.div
            whileHover={{ y: "-10%" }}
            style={{
              backgroundColor:
                elementCommits[parseInt(date)].length <= 8
                  ? bgColor[
                  elementCommits[parseInt(date)].length as bgColorType
                  ]
                  : bgColor[8],
              width: "80%",
              aspectRatio: "1/1",
            }}
            className={`text-sm border border-gray-400 shadow-sm rounded-md flex items-center justify-center`}
          />
        </Tooltip>
      ) : (
        <div
          style={{
            backgroundColor:
              elementCommits[parseInt(date)].length <= 8
                ? bgColor[elementCommits[parseInt(date)].length as bgColorType]
                : bgColor[8],
            width: "80%",
            aspectRatio: "1/1",
          }}
          className={`text-sm border border-gray-400 shadow-sm rounded-md flex items-center justify-center`}
        />
      )}
    </>
  );
};

export default memo(CalendarElementNode);
