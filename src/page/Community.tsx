import { memo, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import UserContext from "../context/user";
import { userInfoAction } from "../redux";
import { RootState } from "../redux/store";
import {
  getBestWritings,
  getAllWritings,
  getUserByUID,
  getAllUsers,
} from "../services/firebase";
import { getFirestoreUser } from "../type";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { AnimatePresence, motion } from "framer-motion";
import WriterRecommandation from "../components/WriterRecommandation";
import BestWritings from "../components/BestWritings";
import { useNavigate } from "react-router-dom";
import SearchAutoComplete from "../SearchAutoComplete/SearchAutoComplete";

const Community = () => {
  const { user: contextUser } = useContext(UserContext);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  // Header context userInfo
  const setUserInfo = (userInfo: getFirestoreUser) => {
    dispatch(userInfoAction.setUserInfo({ userInfo }));
  };
  const userInfo = useSelector(
    (state: RootState) => state.setUserInfo.userInfo
  );

  const [searchNowText, setSearchNowText] = useState("text_snippet");
  const [allBestWritingInfo, setAllBestWritingInfo] = useState([]);
  const [recommandedUsers, setRecommandedUsers] = useState<getFirestoreUser[]>(
    []
  );
  const [allWritings, setAllWritings] = useState<getFirestoreUser[]>([]);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((origin) => !origin);
  };
  const handleClose = (text: string) => {
    setSearchNowText(text);
    setOpen(false);
  };

  const formatResultUser = (item: any) => {
    return (
      <motion.div
        animate={{ opacity: [0, 1] }}
        layout
        onClick={() => {
          navigator(`/${item.item.uid}`);
        }}
        className="px-5 py-2 flex items-center font-noto cursor-pointer"
      >
        <img
          src={item.item.profileImg}
          alt="profile"
          className="w-7 rounded-full mr-2"
        />
        <span>{item.item.username}</span>
      </motion.div>
    );
  };
  const formatResultWriting = (item: any) => {
    return (
      <motion.div
        animate={{ opacity: [0, 1] }}
        layout
        key={item.item.writingUID}
        onClick={() => {
          navigator(
            `/writings/${item.item.userUID}/${item.item.genre}/${item.item.writingUID}`
          );
        }}
        className="px-5 py-2 flex items-center font-noto cursor-pointer"
      >
        <span className="mr-2">{item.item.genre}</span>
        <span>{item.item.title}</span>
      </motion.div>
    );
  };
  const memoizedFormatResultWriting = memo(formatResultWriting);
  useEffect(() => {
    contextUser.uid &&
      getUserByUID(contextUser.uid).then((res: any) => {
        const data = res.docs[0].data();
        setUserInfo(data);
      });
    getAllWritings();
  }, [contextUser.uid]);

  useEffect(() => {
    const handleGetAllBestWritingInfo = async () => {
      setAllBestWritingInfo(await getBestWritings());
    };
    const handleRecommandedUsers = async () => {
      setRecommandedUsers(await getAllUsers());
    };
    const handleGetAllWritings = async () => {
      setAllWritings(await getAllWritings());
    };
    handleGetAllBestWritingInfo();
    handleRecommandedUsers();
    handleGetAllWritings();
  }, []);

  return (
    <div className="w-full font-noto flex flex-col items-center">
      <Header userInfo={userInfo} />
      {/* Search Div */}
      <div className="border w-1/3 max-w-lg rounded-3xl bg-opacity-90 px-3 py-2 flex items-center justify-center shadow-md">
        {recommandedUsers.length > 0 && (
          <div className="w-full flex items-center">
            <div className="relative">
              <span
                onClick={handleClick}
                className="material-icons text-gray-500 px-1 py-1 rounded-full hover:bg-gray-300 cursor-pointer mr-2"
              >
                {searchNowText}
              </span>
              <AnimatePresence>
                {open && (
                  <motion.div className="absolute bg-slate-200">
                    <Tooltip arrow placement="left" title="작가">
                      <MenuItem
                        onClick={() => {
                          handleClose("account_circle");
                        }}
                      >
                        <span className="material-icons text-gray-500">
                          account_circle
                        </span>
                      </MenuItem>
                    </Tooltip>
                    <Tooltip arrow placement="left" title="작품">
                      <MenuItem
                        onClick={() => {
                          handleClose("text_snippet");
                        }}
                      >
                        <span className="material-icons text-gray-500">
                          text_snippet
                        </span>
                      </MenuItem>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative w-full h-full">
              <SearchAutoComplete
                matchNumber={2}
                items={
                  searchNowText === "text_snippet"
                    ? allWritings
                    : recommandedUsers
                }
                SearchedRow={
                  searchNowText === "text_snippet"
                    ? memoizedFormatResultWriting
                    : formatResultUser
                }
                matchKeys={
                  searchNowText === "text_snippet" ? "title" : "username"
                }
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col w-3/4 mt-10">
        <span className="text-2xl font-bold">이 달의 글</span>
        <div className="flex py-8 space-x-10 w-full">
          {allBestWritingInfo.map((data, index) => (
            <div key={index} style={{ minWidth: "30%" }} className="w-1/3">
              <BestWritings
                data={data}
                medal={index === 0 ? "GOLD" : index === 1 ? "SILVER" : "BRONZE"}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-3/4 mt-10">
        <span className="text-2xl font-bold">추천 작가</span>
        <div className="grid grid-cols-3 py-8 gap-10 w-full">
          {recommandedUsers.map((data, index) => (
            <div
              key={index}
              style={{ minWidth: "30%" }}
              className="snap-center"
            >
              <WriterRecommandation key={data.uid} data={data} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-3/4 mt-10">
        <span className="text-2xl font-bold">신춘 문예</span>
        <div></div>
      </div>
    </div>
  );
};

export default Community;
