import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestoreUser } from "../type";

interface props {
  userInfo: getFirestoreUser;
}

const Header: React.FC<props> = ({ userInfo }) => {
  const navigator = useNavigate();

  return (
    <div className="flex w-full items-center justify-between px-20">
      {/* logo */}
      <img
        onClick={() => {
          userInfo.uid
            ? navigator(`/${userInfo.uid}`)
            : navigator("/community");
        }}
        className="h-28 cursor-pointer"
        src="/logo/Ollim-logos_transparent.png"
        alt="header logo"
      />
      {userInfo.uid ? (
        <div
          onClick={() => {
            navigator(`/${userInfo.uid}`);
          }}
          className="flex items-center cursor-pointer border border-writingSettingBorder px-4 py-2 rounded-3xl"
        >
          <img
            src={userInfo.profileImg}
            className="w-7 mr-3 rounded-full"
            alt="user profile"
          />
          <span>{userInfo.username}</span>
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
