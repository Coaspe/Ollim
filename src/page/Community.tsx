import { useContext, useEffect, useState } from "react";
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
import SearchAutoComplete from "../SearchAutoComplete/SearchAutoComplete";
import FormatResultWriting from "../SearchAutoComplete/FormatResultWriting";
import FormatResultUser from "../SearchAutoComplete/FormatResultUser";

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

  const [searchNowText, setSearchNowText] = useState("text_snippet");
  const [allBestWritingInfo, setAllBestWritingInfo] = useState([]);
  const [recommandedUsers, setRecommandedUsers] = useState<getFirestoreUser[]>(
    []
  );
  const [allWritings, setAllWritings] = useState<getFirestoreUser[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    allBestWritingInfo.length &&
      recommandedUsers.length &&
      allWritings.length &&
      setLoading(false);
  }, [allBestWritingInfo, recommandedUsers, allWritings]);

  return (
    <div className="w-full font-noto flex flex-col items-center">
      <Header userInfo={userInfo} />

      {/* Search Div */}
      {!loading ? (
        <>
          <div className="border w-1/3 max-w-lg rounded-3xl bg-opacity-90 px-3 py-2 flex items-center justify-center shadow-md GalaxyS20Ultra:w-2/3">
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
                      <motion.div
                        animate={{ scale: 1 }}
                        className="absolute bg-slate-200"
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
                        ? FormatResultWriting
                        : FormatResultUser
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
            <div className="flex py-8 space-x-10 w-full GalaxyS20Ultra:overflow-x-scroll GalaxyS20Ultra:snap-x">
              {allBestWritingInfo.map((data, index) => (
                <div
                  key={index}
                  className="w-1/3 min-w-1/3 GalaxyS20Ultra:w-full GalaxyS20Ultra:min-w-full GalaxyS20Ultra:snap-center"
                >
                  <BestWritings
                    data={data}
                    medal={
                      index === 0 ? "GOLD" : index === 1 ? "SILVER" : "BRONZE"
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col w-3/4 mt-10">
            <span className="text-2xl font-bold">추천 작가</span>
            <div className="grid grid-cols-3 py-8 gap-10 w-full GalaxyS20Ultra:flex GalaxyS20Ultra:items-center GalaxyS20Ultra:overflow-x-scroll">
              {recommandedUsers.map((data, index) => (
                <div
                  key={index}
                  className="w-full min-w-1/3 GalaxyS20Ultra:min-w-full GalaxyS20Ultra:snap-center"
                >
                  <WriterRecommandation key={data.uid} data={data} />
                </div>
              ))}
            </div>
          </div>

          {/* <div className="flex flex-col w-3/4 mt-10">
            <span className="text-2xl font-bold">신춘 문예</span>
            <div></div>
          </div> */}
        </>
      ) : (
        // Loading Page
        <div className="w-screen h-screen flex items-center justify-center bg-opacity-30">
          <img
            src="/logo/Ollim-logos_black.png"
            className="w-32 opacity-50"
            alt="loading"
          />
        </div>
      )}
    </div>
  );
};

export default Community;
