import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Handle, removeElements, isEdge } from "react-flow-renderer";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { elementsAction } from "../redux";
import "./test.css";

export default memo(({ id, data, isConnectable }) => {
  const elements = useSelector((state) => state.setElements.elements);
  const dispatch = useDispatch();
  const [click, setClick] = useState(false);
  const [labelToggle, setLabelToggle] = useState(false);
  const [labelState, setLabelState] = useState(data.label);
  const [descState, setDescState] = useState(data.desc);
  const inputRef = useRef();
  const [mouseEnter, setMouseEnter] = useState(false);

  const setElements = useCallback(
    (elements) => {
      dispatch(elementsAction.setElements({ elements: elements }));
    },
    [dispatch]
  );

  const onElementsRemove = () => {
    const target = elements.find((data) => data.id === id);
    setElements([...removeElements([target], elements)]);
  };
  const onDescChange = (event) => {
    const tt = elements.slice();
    const tmp = tt.map((e) => {
      if (isEdge(e) || e.id !== id) {
        return e;
      }

      const desc = event.target.value;

      return {
        ...e,
        data: {
          ...e.data,
          desc,
        },
      };
    });
    setElements([...tmp]);
  };
  const onLabelChange = (event) => {
    const tmp = elements.map((e) => {
      if (isEdge(e) || e.id !== id) {
        return e;
      }

      const label = event.target.value;

      return {
        ...e,
        data: {
          ...e.data,
          label,
        },
      };
    });
    setElements([...tmp]);
  };

  useEffect(() => {
    labelToggle && inputRef?.current.focus();
  }, [labelToggle]);

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      inputRef?.current.blur();
    }
  };

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
        {/* Delete Node SVG */}
        <svg
          className={`fill-gray-400 w-4 cursor-pointer hover:fill-gray-500`}
          viewBox="0 0 24 24"
          onClick={() => {
            onElementsRemove(id);
          }}
        >
          <path d="M11.4698 2.25H11.5302C12.0129 2.24999 12.421 2.24998 12.7592 2.27848C13.1166 2.30859 13.451 2.37374 13.7758 2.53412C14.0492 2.66911 14.2983 2.84863 14.5129 3.06534C14.7677 3.32282 14.9353 3.61939 15.0768 3.94892C15.2108 4.26078 15.3399 4.64793 15.4925 5.10588L15.7115 5.76283C15.7377 5.84148 15.7502 5.92141 15.7502 6H18.2222C19.2041 6 20 6.79594 20 7.77778C20 7.90051 19.9005 8 19.7778 8H3.22222C3.09949 8 3 7.90051 3 7.77778C3 6.79594 3.79594 6 4.77778 6H7.24979C7.2498 5.92141 7.26226 5.84148 7.28848 5.76283L7.50745 5.10592C7.66009 4.64796 7.78913 4.26078 7.92313 3.94892C8.06472 3.61939 8.23225 3.32282 8.48713 3.06534C8.70165 2.84863 8.95073 2.66911 9.22416 2.53412C9.54902 2.37374 9.88335 2.30859 10.2407 2.27848C10.579 2.24998 10.9871 2.24999 11.4698 2.25ZM14.079 5.60888L14.2094 6H8.79056L8.92093 5.60888C9.08566 5.11469 9.19521 4.788 9.3013 4.54107C9.40259 4.30534 9.47964 4.19487 9.55315 4.12061C9.65067 4.02211 9.76388 3.9405 9.88817 3.87915C9.98186 3.83289 10.111 3.79473 10.3667 3.77318C10.6345 3.75062 10.9791 3.75 11.5 3.75C12.0209 3.75 12.3655 3.75062 12.6333 3.77318C12.889 3.79473 13.0181 3.83289 13.1118 3.87915C13.2361 3.9405 13.3493 4.02211 13.4468 4.12061C13.5203 4.19487 13.5974 4.30534 13.6987 4.54107C13.8048 4.788 13.9143 5.11469 14.079 5.60888Z" />
          <path d="M6.31017 21.6385C5.88874 21.2769 5.79537 20.67 5.60863 19.4562L4.08861 9.57603C4.04742 9.3083 4.02682 9.17444 4.10165 9.08722C4.17647 9 4.31191 9 4.58279 9H18.4172C18.6881 9 18.8235 9 18.8983 9.08722C18.9731 9.17444 18.9526 9.3083 18.9114 9.57603L17.3913 19.4562C17.2046 20.67 17.1112 21.2769 16.6898 21.6385C16.2684 22 15.6543 22 14.4262 22H8.57374C7.34564 22 6.7316 22 6.31017 21.6385Z" />
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
            className="absolute text-xs -top-20 border border-black w-48 h-16 px-3 py-2 resize-none rounded-xl placeholder:italic focus:outline-none"
            value={descState}
            placeholder={descState ? descState : "간략한 설명을 기록하세요."}
            onBlur={(e) => {
              onDescChange(e);
            }}
            onChange={(event) => {
              setDescState(event.target.value);
            }}
          >
            {data.desc}
          </motion.textarea>
        )}
      </AnimatePresence>

      <div
        onDoubleClick={() => {
          setLabelToggle((origin) => !origin);
        }}
        className="flex custom-drag-handle h-full w-full items-center justify-center rounded-xl"
      >
        {/* If double click occur, activate input to edit label */}
        {!labelToggle ? (
          <strong className={`text-2xl ${!labelState && "text-gray-400"}`}>
            {labelState ? labelState : "이름"}
          </strong>
        ) : (
          <input
            ref={inputRef}
            onBlur={(e) => {
              onLabelChange(e);
              setLabelToggle(false);
            }}
            onChange={(event) => {
              setLabelState(event.target.value);
            }}
            onKeyPress={onKeyPress}
            className="w-full text-center bg-transparent text-black focus:outline-none"
            type="text"
            value={labelState}
          />
        )}
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
