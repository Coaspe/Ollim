import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import UserContext from "../context/user";
import { userInfoAction } from "../redux";
import { RootState } from "../redux/store";
import {
  getAllUsers,
  getAllWritings,
  getUserByUID,
} from "../services/firebase";
import { getFirestoreUser } from "../type";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { AnimatePresence, motion } from "framer-motion";
import WriterRecommandation from "../components/WriterRecommandation";
import BestWritings from "../components/BestWritings";

const Community = () => {
  const { user: contextUser } = useContext(UserContext);
  const dispatch = useDispatch();

  // Header context userInfo
  const setUserInfo = (userInfo: getFirestoreUser) => {
    dispatch(userInfoAction.setUserInfo({ userInfo }));
  };
  const userInfo = useSelector(
    (state: RootState) => state.setUserInfo.userInfo
  );

  const [searchNowText, setSearchNowText] = useState("account_circle");
  const [allBestWritingInfo, setAllBestWritingInfo] = useState([]);
  const [recommandedUsers, setRecommandedUsers] = useState<getFirestoreUser[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((origin) => !origin);
  };
  const handleClose = (text: string) => {
    setSearchNowText(text);
    setOpen(false);
  };

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
      setAllBestWritingInfo(await getAllWritings());
    };
    const handleRecommandedUsers = async () => {
      setRecommandedUsers(await getAllUsers());
    };
    handleGetAllBestWritingInfo();
    handleRecommandedUsers();
  }, []);
  return (
    <div className="w-full font-noto flex flex-col items-center">
      <Header userInfo={userInfo} />
      {/* Search Div */}
      <div className="border w-1/3 max-w-lg rounded-3xl bg-gray-200 bg-opacity-90 px-3 py-2 flex items-center justify-center shadow-md">
        <div className="relative">
          <span
            onBlur={() => {
              console.log("Blur");
            }}
            onClick={handleClick}
            className="material-icons text-gray-500 px-1 py-1 rounded-full hover:bg-gray-300 cursor-pointer mr-2"
          >
            {searchNowText}
          </span>
          <AnimatePresence>
            {open && (
              <motion.div
                className="absolute bg-slate-200"
                onBlur={() => {
                  console.log("Blur");
                }}
              >
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
        <input type="text" className="w-full focus:outline-none bg-white" />
        <span className="text-gray-500 cursor-pointer material-icons rounded-full ml-3 px-1 py-1 hover:bg-gray-300">
          search
        </span>
      </div>
      <div className="flex flex-col w-3/4 mt-10">
        <span className="text-2xl font-bold">이 달의 글</span>
        <div className="flex py-8 space-x-10 w-full">
          {allBestWritingInfo.map((data, index) => (
            <div style={{ minWidth: "30%" }} className="w-1/3">
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
        <div className="flex snap-x overflow-x-scroll py-8 space-x-10 w-full">
          {recommandedUsers.map((data, index) => (
            <div style={{ minWidth: "30%" }} className="snap-center">
              <WriterRecommandation data={data} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-3/4 mt-10">
        <span className="text-2xl font-bold">문예지 소식</span>
        <div></div>
      </div>
    </div>
  );
};

export default Community;
