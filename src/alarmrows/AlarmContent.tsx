import {
  alarmCategory,
  alarmNewCommit,
  totalAlarmType,
  alarmAddCommentInfo,
  alarmFollowingInfo,
  alarmAddWritingInfo,
  alarmRankInInfo,
} from "../type";

interface props {
  info: totalAlarmType;
  category: alarmCategory;
}

const AlarmContent: React.FC<props> = ({ info, category }) => {
  if (category === "ADDCOMMENT") {
    return (
      <>
        <span className="text-sm font-bold">
          {(info as alarmAddCommentInfo).writingTitle}
        </span>
        <span style={{ fontSize: "0.7rem" }}>
          <span className="font-bold text-slate-600">
            {(info as alarmAddCommentInfo).commentUsername}
          </span>
          <span> 님의 새 댓글</span>
        </span>
      </>
    );
  } else if (category === "FOLLOWING") {
    return (
      <>
        <span className="text-sm font-bold">
          {(info as alarmFollowingInfo).followingUsername}
          <span style={{ fontSize: "0.7rem" }}>
            {" "}
            님이 회원님을 팔로우합니다.
          </span>
        </span>
      </>
    );
  } else if (category === "NEWCOMMIT") {
    return (
      <>
        <span className="font-bold">
          {(info as alarmNewCommit).writingOwnerUsername}
        </span>
        <span className="text-gray-500 font-bold">
          {(info as alarmNewCommit).writingTitle}
        </span>
        <span style={{ fontSize: "0.7rem" }}>새로운 제출이 있습니다</span>
      </>
    );
  } else if (category === "NEWWRITING") {
    return (
      <>
        <span className="text-sm font-bold">
          {(info as alarmAddWritingInfo).writingOwnerUsername}
          <span className="font-normal"> 님이 새 글을 작성하였습니다.</span>
        </span>
      </>
    );
  } else if (category === "RANKIN") {
    return (
      <>
        <span className="text-sm font-bold">
          {(info as alarmRankInInfo).rankedInWritingTitle}
        </span>
        {(info as alarmRankInInfo).type === "NEW" && (
          <span style={{ fontSize: "0.7rem" }}>
            작가님의 작품이 랭크에 올라갔습니다
          </span>
        )}
        {(info as alarmRankInInfo).type === "THIRDTOSECOND" && (
          <span style={{ fontSize: "0.7rem" }}>
            작가님의 작품이 3등에서 2등이 되었습니다
          </span>
        )}
        {(info as alarmRankInInfo).type === "THIRDTOFIRST" && (
          <span style={{ fontSize: "0.7rem" }}>
            작가님의 작품이 3등에서 1등이 되었습니다
          </span>
        )}
        {(info as alarmRankInInfo).type === "SECONDTOFIRST" && (
          <span style={{ fontSize: "0.7rem" }}>
            작가님의 작품이 2등에서 1등이 되었습니다
          </span>
        )}
      </>
    );
  }
  return <></>;
};

export default AlarmContent;
