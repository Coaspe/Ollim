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
    navigator(
      `/writings/${(info as alarmAddCommentInfo).writingOwnerUID}/${
        (info as alarmAddCommentInfo).writingDocID
      }/${(info as alarmAddCommentInfo).commentDocID}`
    );
  } else if (category === "FOLLOWING") {
    navigator(`/${(info as alarmFollowingInfo).followingUserUID}`);
  } else if (category === "NEWCOMMIT") {
    navigator(
      `/writings/${(info as alarmNewCommit).writingOwnerUID}/${
        (info as alarmNewCommit).writingDocID
      }`
    );
  } else if (category === "NEWWRITING") {
    navigator(
      `/writings/${(info as alarmAddWritingInfo).writingOwnerUID}/${
        (info as alarmAddWritingInfo).writingDocID
      }`
    );
  } else if (category === "RANKIN") {
    navigator("/community");
  }
};
