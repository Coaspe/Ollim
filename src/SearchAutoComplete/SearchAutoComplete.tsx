import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface rowProps {
  item: {};
}

interface props {
  searchNowText: string;
  matchNumber: number;
  items: any[];
  matchKeys: string;
  SearchedRow: React.FC<rowProps>;
}

const SearchAutoComplete: React.FC<props> = ({
  searchNowText,
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

  useEffect(() => {
    setSearchedItems([]);
  }, [searchNowText]);

  useEffect(() => {
    document.addEventListener("click", (e: any) => {
      setOpen(e.target.className.includes("search"));
    });
  }, []);

  return (
    <motion.div
      layout
      onClick={(e) => {
        e.stopPropagation();
      }}
      onFocus={() => {
        setOpen(true);
      }}
      className="search w-full py-2 px-2 h-fit relative inline-block"
    >
      <input
        autoFocus
        ref={inputRef}
        className="search w-full h-full bg-transparent focus:outline-none"
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
        <motion.div
          layout
          style={{ top: "100%", left: 0, right: 0, zIndex: 99 }}
          className="absolute bg-slate-50"
        >
          {searchedItems.map((item, index) => (
            <SearchedRow key={index} item={item} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchAutoComplete;
