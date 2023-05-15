import { useNavigate } from "react-router-dom";
import { getFirestoreUser } from "../../type";

interface props {
  data: getFirestoreUser;
}
const WriterRecommandation: React.FC<props> = ({ data }) => {
  const navigator = useNavigate();
  const handleNavigate = () => {
    navigator(`/${data.uid}`);
  };
  return (
    <div
      onClick={handleNavigate}
      className="w-full h-full relative flex flex-col text-noto cursor-pointer border border-logoBrown border-opacity-50 rounded-xl shadow-lg py-5 px-3 z-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={data.profileImg}
            className="rounded-full w-7 h-7 object-cover"
            alt="recommandation"
          />
          <span>{data.username}</span>
        </div>
        <div
          style={{ fontSize: "0.7rem" }}
          className="flex items-center space-x-3"
        >
          <div className="flex flex-col items-center">
            <span>{data.followers.size}</span>
            <span>팔로워</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{data.followings.size}</span>
            <span>팔로잉</span>
          </div>
        </div>
      </div>
      <div className="flex items-center"></div>
    </div>
  );
};

export default WriterRecommandation;
