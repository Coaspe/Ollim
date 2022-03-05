import {
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
} from "react-flow-renderer";
import { memo } from "react";

export default memo(function CustomEdgeReadOnly({
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
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

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
        <div className="group w-full h-full flex items-center justify-center relative">
          {/* SVG div */}
          <div
            style={{ backgroundColor: "#faf6f5" }}
            className="w-full h-fit py-1 flex items-center justify-center border border-gray-500 rounded-lg text-center"
          >
            <span
              className={`text-xs text-center w-full h-full bg-transparent focus:outline-none`}
            >
              {data.label}
            </span>
          </div>
        </div>
      </foreignObject>
    </>
  );
});
