import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface rowProps {
  item: {};
  focus: boolean;
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
  const [searchedItems, setSearchedItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSeletedIndex] = useState(-1);
  const arrowKeyDown = useRef(false);

  useEffect(() => {
    if (searchedItems) {
      setOpen(true);
    }
  }, [searchedItems]);
  return (
    <motion.div
      layout
      onBlur={() => {
        setOpen(false);
        setSeletedIndex(-1);
      }}
      onFocus={() => {
        arrowKeyDown.current = !arrowKeyDown.current;
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" && arrowKeyDown.current && selectedIndex > 0) {
          setSeletedIndex((origin) => origin - 1);
        }
        if (
          e.key === "ArrowDown" &&
          arrowKeyDown.current &&
          selectedIndex < searchedItems.length
        ) {
          setSeletedIndex((origin) => origin + 1);
        }
      }}
      className="w-full py-2 px-2 h-fit flex flex-col relative"
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
      {searchedItems && open && (
        <motion.div layout className="absolute bg-white w-full top-10 left-0">
          {searchedItems.map((item, index) => (
            <SearchedRow
              key={index}
              item={item}
              focus={index === selectedIndex}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchAutoComplete;
