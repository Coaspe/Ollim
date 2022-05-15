import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUID } from "../../services/firebase";
import {
  genre,
  genreMatching,
  getFirestoreUser,
  getFirestoreWriting,
  medal,
} from "../../type";

interface props {
  data: getFirestoreWriting;
  medal?: medal;
}

const BestWriting: React.FC<props> = ({ data, medal }) => {
  const [writingOwnerInfo, setWritingOwnerInfo] = useState(
    {} as getFirestoreUser
  );
  const navigator = useNavigate();
  useEffect(() => {
    const effctGetUserByUID = async () => {
      const userInfo = await getUserByUID(data.userUID);
      setWritingOwnerInfo(userInfo);
    };
    data.userUID && effctGetUserByUID();
  }, [data.userUID]);
  return (
    <motion.div
      whileHover={{ y: "-10%" }}
      onClick={() => {
        navigator(`/writings/${data.userUID}/${data.writingDocID}`);
      }}
      className="relative w-full h-full"
    >
      {writingOwnerInfo.profileImg && (
        <motion.img
          // style={{ filter: "grayscale(100%)" }}
          // whileHover={{
          // filter: "grayscale(0%)",
          // transition: {
          // duration: 0.3,
          // },
          // }}
          onClick={() => {
            navigator(`/${data.userUID}`);
          }}
          className="w-7 h-7 object-cover rounded-full absolute bottom-2 right-2 shadow-lg z-10"
          src={writingOwnerInfo.profileImg}
          alt="profile"
        />
      )}
      <div
        key="container-before"
        className="w-full h-full relative flex flex-col text-noto border border-logoBrown border-opacity-50 rounded-xl shadow-lg cursor-pointer py-5 px-3 z-0"
      >
        <div className="mb-3 flex items-center w-full justify-between">
          <div className="flex items-center">
            <span className="text-xl font-black">{data.title}</span>
            <span className="text-sm text-gray-700 font-black ml-3">
              {genreMatching[data.genre as genre]}
            </span>
          </div>
          {medal && (
            <img className="w-7" src={`/svg/${medal}.svg`} alt={medal} />
          )}
        </div>
        <textarea
          value={data.synopsis}
          readOnly
          className="text-sm text-gray-400 mb-3 font-semibold bg-transparent resize-none overflow-hidden pointer-events-none"
        >
          {data.synopsis}
        </textarea>
      </div>
    </motion.div>
  );
};

export default memo(BestWriting);
