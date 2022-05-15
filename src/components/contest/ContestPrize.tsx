import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getWritingsArrayInfo } from "../../services/firebase";
import { contestWriting, getFirestoreWriting } from "../../type";
import BestWritings from "../writingComponents/BestWritings";

interface props {
  prize: Array<contestWriting>;
}
const ContestPrize: React.FC<props> = ({ prize }) => {
  const [prizedWritingsInfo, setPrizedWritingsInfo] = useState<
    Array<getFirestoreWriting>
  >([]);
  useEffect(() => {
    const getPrizedWritings = async () => {
      let prizeDocID = prize.map((data: contestWriting) => data.writingDocID);
      const writings = await getWritingsArrayInfo(prizeDocID);
      setPrizedWritingsInfo(writings);
    };
    prize && getPrizedWritings();
  }, [prize]);
  return (
    <>
      <div className="flex flex-col mb-20 w-2/3 GalaxyS20Ultra:w-full">
        <span className="text-2xl font-bold mb-10">수상 작품</span>

        <motion.div
          layout
          className="grid grid-cols-3 items-center justify-between w-full gap-5 GalaxyS20Ultra:flex GalaxyS20Ultra:flex-col GalaxyS20Ultra:items-center GalaxyS20Ultra:overflow-y-scroll GalaxyS20Ultra:max-h-72 GalaxyS20Ultra:py-5 GalaxyS20Ultra:px-3"
        >
          {prizedWritingsInfo.length > 0 &&
            prizedWritingsInfo.map((data, idx) => {
              return (
                <BestWritings
                  key={data.dateCreated}
                  data={data}
                  medal={idx === 0 ? "GOLD" : idx === 1 ? "SILVER" : "BRONZE"}
                />
              );
            })}
        </motion.div>
      </div>
    </>
  );
};

export default ContestPrize;
