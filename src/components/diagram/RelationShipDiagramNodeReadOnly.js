import { memo, useState } from "react";
import { Handle } from "react-flow-renderer";
import { motion, AnimatePresence } from "framer-motion";
import "../../style/DiagramNode.css";

export default memo(({ id, data, isConnectable }) => {
  const [click, setClick] = useState(false);
  const [mouseEnter, setMouseEnter] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
      onMouseLeave={() => {
        setMouseEnter(false);
      }}
      className="border border-black relative flex items-center justify-center bg-white w-28 h-28 hover:bg-slate-100"
    >
      {/* Show expand SVG when mouse enters in div */}
      <div
        className={`absolute w-5 h-full top-0 right-0 flex flex-col items-center justify-evenly ${
          !mouseEnter && "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          // Prevent Double click on Div (line 78)
          e.stopPropagation();
        }}
      >
        {/* Expand SVG */}
        <svg
          className={`fill-gray-400 w-4 cursor-pointer rounded-full hover:fill-gray-500`}
          onClick={(e) => {
            setClick((origin) => !origin);
          }}
          viewBox="0 0 24 24"
        >
          <path
            d="M2.75,17 L15.25,17 C15.6642136,17 16,17.3357864 16,17.75 C16,18.1296958 15.7178461,18.443491 15.3517706,18.4931534 L15.25,18.5 L2.75,18.5 C2.33578644,18.5 2,18.1642136 2,17.75 C2,17.3703042 2.28215388,17.056509 2.64822944,17.0068466 L2.75,17 L15.25,17 L2.75,17 Z M2.75,13 L21.25,13 C21.6642136,13 22,13.3357864 22,13.75 C22,14.1296958 21.7178461,14.443491 21.3517706,14.4931534 L21.25,14.5 L2.75,14.5 C2.33578644,14.5 2,14.1642136 2,13.75 C2,13.3703042 2.28215388,13.056509 2.64822944,13.0068466 L2.75,13 L21.25,13 L2.75,13 Z M2.75,9 L21.25,9 C21.6642136,9 22,9.33578644 22,9.75 C22,10.1296958 21.7178461,10.443491 21.3517706,10.4931534 L21.25,10.5 L2.75,10.5 C2.33578644,10.5 2,10.1642136 2,9.75 C2,9.37030423 2.28215388,9.05650904 2.64822944,9.00684662 L2.75,9 L21.25,9 L2.75,9 Z M2.75,5 L21.25,5 C21.6642136,5 22,5.33578644 22,5.75 C22,6.12969577 21.7178461,6.44349096 21.3517706,6.49315338 L21.25,6.5 L2.75,6.5 C2.33578644,6.5 2,6.16421356 2,5.75 C2,5.37030423 2.28215388,5.05650904 2.64822944,5.00684662 L2.75,5 L21.25,5 L2.75,5 Z"
            id="🎨-Color"
          ></path>
        </svg>
      </div>
      <AnimatePresence>
        {click && (
          <motion.textarea
            key="textarea"
            animate={{ opacity: [0, 1], y: [10, 0] }}
            exit={{ opacity: [1, 0], y: [0, 10] }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            role="tooltip"
            className="absolute pointer-events-none text-xs -top-20 border border-black w-48 h-16 px-3 py-2 resize-none rounded-xl"
          >
            {data.desc}
          </motion.textarea>
        )}
      </AnimatePresence>

      <div className="flex custom-drag-handle h-full w-full items-center justify-center rounded-xl">
        <strong className={`text-2xl ${!data.label && "text-gray-400"}`}>
          {data.label ? data.label : "이름"}
        </strong>

        <Handle
          className="test"
          type="source"
          position="left"
          id="q"
          style={{ top: 20 }}
          isConnectable={isConnectable}
        />
        <Handle
          className="test"
          type="target"
          position="left"
          id="qq"
          isConnectable={isConnectable}
        />
        <Handle
          className="test"
          type="source"
          position="left"
          id="qqq"
          style={{ top: 90 }}
          isConnectable={isConnectable}
        />

        <Handle
          type="source"
          position="right"
          id="a"
          style={{ top: 20 }}
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position="right"
          id="aa"
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position="right"
          id="aaa"
          style={{ top: 90 }}
          isConnectable={isConnectable}
        />

        <Handle
          type="target"
          position="bottom"
          id="b"
          style={{ left: 20 }}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position="bottom"
          id="bb"
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position="bottom"
          id="bbb"
          style={{ left: 90 }}
          isConnectable={isConnectable}
        />

        <Handle
          type="target"
          position="top"
          id="c"
          style={{ left: 20 }}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position="top"
          id="cc"
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position="top"
          id="ccc"
          style={{ left: 90 }}
          isConnectable={isConnectable}
        />
      </div>
    </div>
  );
});
