import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { Background } from "react-flow-renderer";
import ColorSelectorNode from "./RelationShipDiagramNodeReadOnly";
import { toObjectElements } from "../type";
import ButtonEdgeReadOnly from "./ButtonEdgeReadOnly";

const onElementClick = (event: any, element: any) =>
  console.log("click", element);

const initBgColor = "#faf6f5";
const edgeTypes = {
  buttonedge: ButtonEdgeReadOnly,
};
const connectionLineStyle = { stroke: "#000" };
const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
};
interface props {
  diagram: toObjectElements;
}
const CustomNodeFlowRDOnly: React.FC<props> = ({ diagram }) => {
  const [reactflowInstance, setReactflowInstance] = useState<any>(null);

  const onLoad = useCallback(
    (rfi) => {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
      }
    },
    [reactflowInstance]
  );
  useEffect(() => {
    reactflowInstance && reactflowInstance.fitView({ padding: 1 });
  }, [reactflowInstance]);
  return (
    <div className="w-full h-80 border-opacity-5 border border-black drop-shadow-lg">
      {diagram.elements && (
        <ReactFlow
          elements={diagram.elements}
          onElementClick={onElementClick}
          style={{ background: initBgColor }}
          onLoad={onLoad}
          nodeTypes={nodeTypes}
          connectionLineStyle={connectionLineStyle}
          snapToGrid={true}
          edgeTypes={edgeTypes}
          snapGrid={snapGrid as [number, number]}
          defaultZoom={1}
        >
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      )}
    </div>
  );
};

export default CustomNodeFlowRDOnly;
