import { useState } from "react";
import { motion } from "framer-motion";

interface rowProps {
  item: {};
}

interface props {
  matchNumber: number;
  items: any[];
  matchKeys: string;
  SearchedRow: React.FC<rowProps>;
}

const SearchAutoComplete: React.FC<props> = ({
  matchNumber,
  items,
  matchKeys,
  SearchedRow,
}) => {
  // const [text, setText] = useState("");
  const [searchedItems, setSearchedItems] = useState<any[]>([]);

  return (
    <motion.div
      layout
      className="w-full py-2 px-5 h-fit flex flex-col relative"
    >
      <input
        autoFocus
        className="w-3/4 h-full bg-transparent focus:outline-none"
        onChange={(e) => {
          if (e.target.value.length >= matchNumber) {
            setSearchedItems(() => {
              let tmp: any[] = [];
              items.forEach((item) => {
                console.log(item[matchKeys]);
                item[matchKeys].includes(e.target.value) && tmp.push(item);
              });
              return tmp;
            });
          } else {
            setSearchedItems([]);
          }
        }}
        type="text"
      />
      <motion.div layout className="absolute bg-white w-full top-10 left-0">
        {searchedItems.map((item, index) => (
          <SearchedRow key={index} item={item} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SearchAutoComplete;
