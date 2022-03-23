import { useEffect, useRef, useState } from "react";
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
  const [searchedItems, setSearchedItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
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
      }}
      onFocus={() => {
        setOpen(true);
      }}
      className="w-full py-2 px-2 h-fit flex flex-col relative"
    >
      <input
        autoFocus
        ref={inputRef}
        className="w-3/4 h-full bg-transparent focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && inputRef.current) {
            inputRef.current.blur();
          }
        }}
        onChange={(e) => {
          if (e.target.value.length >= matchNumber) {
            setSearchedItems(() => {
              let tmp: any[] = [];
              items.forEach((item) => {
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
            <SearchedRow key={index} item={item} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchAutoComplete;
