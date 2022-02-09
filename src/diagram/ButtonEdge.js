import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
  isNode,
} from "react-flow-renderer";
import { memo, useState, useCallback, useRef, useEffect } from "react";
import { removeElements } from "react-flow-renderer";
import { useDispatch, useSelector } from "react-redux";
import { elementsAction } from "../redux";

export default memo(function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const elements = useSelector((state) => state.setElements.elements);
  const dispatch = useDispatch();
  const setElements = useCallback(
    (elements) => {
      dispatch(elementsAction.setElements({ elements: elements }));
    },
    [dispatch]
  );
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [labelState, setLabelState] = useState(data.label);
  const [labelCanChanged, setLabelCanChanged] = useState(false);
  const [divHover, setDivHover] = useState(false);
  const inputRef = useRef(null);
  const onElementsRemove = () => {
    const target = elements.find((data) => data.id === id);
    setElements([...removeElements([target], elements)]);
  };
  const onLabelChange = (event) => {
    const tmp = elements.map((e) => {
      if (isNode(e) || e.id !== id) {
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
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      inputRef?.current.blur();
    }
  };
  useEffect(() => {
    labelCanChanged && inputRef.current.focus();
  }, [labelCanChanged]);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={70}
        height={40}
        x={edgeCenterX - 70 / 2}
        y={edgeCenterY - 40 / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          onMouseEnter={() => {
            setDivHover(true);
          }}
          onMouseLeave={() => {
            setDivHover(false);
          }}
          className="group w-full h-full flex items-center justify-center relative"
        >
          {/* SVG div */}
          <div className="w-full h-fit py-1 flex items-center justify-center border border-gray-500 rounded-lg bg-[#faf6f5] text-center">
            {/* Remove edge, Show edge label svg */}
            {/* Label input */}
            {/* While hover shows svgs and in other cases shows label input with current value*/}
            {divHover && !labelCanChanged ? (
              <>
                <svg
                  className={`fill-gray-400 w-4 h-4 cursor-pointer invisible group-hover:visible hover:fill-gray-500`}
                  viewBox="0 0 24 24"
                  onClick={onElementsRemove}
                >
                  <path d="M11.4698 2.25H11.5302C12.0129 2.24999 12.421 2.24998 12.7592 2.27848C13.1166 2.30859 13.451 2.37374 13.7758 2.53412C14.0492 2.66911 14.2983 2.84863 14.5129 3.06534C14.7677 3.32282 14.9353 3.61939 15.0768 3.94892C15.2108 4.26078 15.3399 4.64793 15.4925 5.10588L15.7115 5.76283C15.7377 5.84148 15.7502 5.92141 15.7502 6H18.2222C19.2041 6 20 6.79594 20 7.77778C20 7.90051 19.9005 8 19.7778 8H3.22222C3.09949 8 3 7.90051 3 7.77778C3 6.79594 3.79594 6 4.77778 6H7.24979C7.2498 5.92141 7.26226 5.84148 7.28848 5.76283L7.50745 5.10592C7.66009 4.64796 7.78913 4.26078 7.92313 3.94892C8.06472 3.61939 8.23225 3.32282 8.48713 3.06534C8.70165 2.84863 8.95073 2.66911 9.22416 2.53412C9.54902 2.37374 9.88335 2.30859 10.2407 2.27848C10.579 2.24998 10.9871 2.24999 11.4698 2.25ZM14.079 5.60888L14.2094 6H8.79056L8.92093 5.60888C9.08566 5.11469 9.19521 4.788 9.3013 4.54107C9.40259 4.30534 9.47964 4.19487 9.55315 4.12061C9.65067 4.02211 9.76388 3.9405 9.88817 3.87915C9.98186 3.83289 10.111 3.79473 10.3667 3.77318C10.6345 3.75062 10.9791 3.75 11.5 3.75C12.0209 3.75 12.3655 3.75062 12.6333 3.77318C12.889 3.79473 13.0181 3.83289 13.1118 3.87915C13.2361 3.9405 13.3493 4.02211 13.4468 4.12061C13.5203 4.19487 13.5974 4.30534 13.6987 4.54107C13.8048 4.788 13.9143 5.11469 14.079 5.60888Z" />
                  <path d="M6.31017 21.6385C5.88874 21.2769 5.79537 20.67 5.60863 19.4562L4.08861 9.57603C4.04742 9.3083 4.02682 9.17444 4.10165 9.08722C4.17647 9 4.31191 9 4.58279 9H18.4172C18.6881 9 18.8235 9 18.8983 9.08722C18.9731 9.17444 18.9526 9.3083 18.9114 9.57603L17.3913 19.4562C17.2046 20.67 17.1112 21.2769 16.6898 21.6385C16.2684 22 15.6543 22 14.4262 22H8.57374C7.34564 22 6.7316 22 6.31017 21.6385Z" />
                </svg>
                <svg
                  className={`fill-gray-400 w-4 h-4 cursor-pointer invisible group-hover:visible rounded-full hover:fill-gray-500`}
                  viewBox="0 0 24 24"
                  onClick={() => {
                    setLabelCanChanged(true);
                  }}
                >
                  <path
                    d="M2.75,17 L15.25,17 C15.6642136,17 16,17.3357864 16,17.75 C16,18.1296958 15.7178461,18.443491 15.3517706,18.4931534 L15.25,18.5 L2.75,18.5 C2.33578644,18.5 2,18.1642136 2,17.75 C2,17.3703042 2.28215388,17.056509 2.64822944,17.0068466 L2.75,17 L15.25,17 L2.75,17 Z M2.75,13 L21.25,13 C21.6642136,13 22,13.3357864 22,13.75 C22,14.1296958 21.7178461,14.443491 21.3517706,14.4931534 L21.25,14.5 L2.75,14.5 C2.33578644,14.5 2,14.1642136 2,13.75 C2,13.3703042 2.28215388,13.056509 2.64822944,13.0068466 L2.75,13 L21.25,13 L2.75,13 Z M2.75,9 L21.25,9 C21.6642136,9 22,9.33578644 22,9.75 C22,10.1296958 21.7178461,10.443491 21.3517706,10.4931534 L21.25,10.5 L2.75,10.5 C2.33578644,10.5 2,10.1642136 2,9.75 C2,9.37030423 2.28215388,9.05650904 2.64822944,9.00684662 L2.75,9 L21.25,9 L2.75,9 Z M2.75,5 L21.25,5 C21.6642136,5 22,5.33578644 22,5.75 C22,6.12969577 21.7178461,6.44349096 21.3517706,6.49315338 L21.25,6.5 L2.75,6.5 C2.33578644,6.5 2,6.16421356 2,5.75 C2,5.37030423 2.28215388,5.05650904 2.64822944,5.00684662 L2.75,5 L21.25,5 L2.75,5 Z"
                    id="🎨-Color"
                  ></path>
                </svg>
              </>
            ) : (
              <input
                placeholder={`${labelState ? labelState : "관계"}`}
                onKeyPress={onKeyPress}
                ref={inputRef}
                className={`text-xs text-center w-full h-full bg-transparent visible ${
                  !labelCanChanged && "group-hover:invisible"
                } focus:outline-none`}
                onBlur={(e) => {
                  onLabelChange(e);
                  setLabelCanChanged(false);
                }}
                onChange={(e) => {
                  setLabelState(e.target.value);
                }}
                value={labelState}
              />
            )}
          </div>
        </div>
      </foreignObject>
    </>
  );
});
