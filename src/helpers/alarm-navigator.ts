import { NavigateFunction } from "react-router-dom";
import {
  alarmAddWritingInfo,
  totalAlarmType,
  alarmCategory,
  alarmAddCommentInfo,
  alarmFollowingInfo,
  alarmNewCommit,
} from "../type";
export const alarmNavigator = (
  info: totalAlarmType,
  category: alarmCategory,
  navigator: NavigateFunction
) => {
  if (category === "ADDCOMMENT") {
    info = info as alarmAddCommentInfo
    navigator(
      `/writings/${info.writingOwnerUID}/${info.writingDocID
      }/${info.commentDocID}`
    );
  } else if (category === "FOLLOWING") {
    info = info as alarmFollowingInfo
    navigator(`/${info.followingUserUID}`);
  } else if (category === "NEWCOMMIT") {
    info = info as alarmNewCommit
    navigator(
      `/writings/${info.writingOwnerUID}/${info.writingDocID
      }`
    );
  } else if (category === "NEWWRITING") {
    info = info as alarmAddWritingInfo
    navigator(
      `/writings/${info.writingOwnerUID}/${info.writingDocID
      }`
    );
  } else if (category === "RANKIN") {
    navigator("/community");
  }
};
