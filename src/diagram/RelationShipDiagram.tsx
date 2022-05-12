import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  ControlButton,
  Elements,
  Background,
} from "react-flow-renderer";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import ColorSelectorNode from "./RelationShipDiagramNode";
import {
  alarmAction,
  alarmTimerAction,
  diagramAction,
  elementsAction,
} from "../redux";
import { RootState } from "../redux/store";
import ButtonEdge from "./ButtonEdge";
import { toObjectElements, alarmType } from "../type";
import axios from "axios";
const initBgColor = "#faf6f5";
const edgeTypes = {
  buttonedge: ButtonEdge,
};
const connectionLineStyle = { stroke: "#000" };
const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
};
interface props {
  writingDocID?: string;
  genre?: string;
  isInitialMount?: React.MutableRefObject<number>;
}
const DiagramWrite: React.FC<props> = ({
  writingDocID,
  genre,
  isInitialMount,
}) => {
  const [reactflowInstance, setReactflowInstance] = useState<any>(null);

  // For prevent unchanged save
  const pos = useRef([10, 10]);
  const [bgColor, setBgColor] = useState<any>(initBgColor);
  const dispatch = useAppDispatch();

  const elements: Elements<any> = useAppSelector(
    (state: RootState) => state.setElements.elements
  );
  const setElements = useCallback(
    (elements: Elements<any>) => {
      dispatch(elementsAction.setElements({ elements: elements }));
    },
    [dispatch]
  );
  const setAlarm = (alarm: [string, alarmType, boolean]) => {
    dispatch(alarmAction.setAlarm({ alarm }));
  };

  const diagram = useAppSelector(
    (state: RootState) => state.setDiagram.diagram
  );
  const setDiagram = useCallback(
    (diagram: toObjectElements) => {
      dispatch(diagramAction.setDiagram({ diagram }));
    },
    [dispatch]
  );

  const timer = useAppSelector((state: RootState) => state.setAlarmTimer.timer);
  const setAlarmTimer = (timer: NodeJS.Timeout | null) => {
    dispatch(alarmTimerAction.setAlarmTimer({ timer }));
  };
  const onLoad = useCallback(
    (rfi) => {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
      }
    },
    [reactflowInstance]
  );

  const addNode = () => {
    let num = 0;
    elements.forEach((data) => {
      data.type && (num += 1);
    });

    const addedNode = {
      id: (num + 1).toString(),
      type: "selectorNode",
      dragHandle: ".custom-drag-handle",
      data: { color: initBgColor, label: "", desc: "" },
      position: { x: pos.current[0], y: pos.current[1] },
    };
    pos.current[0] += 10;
    pos.current[1] += 10;
    setElements([...elements, addedNode]);
    console.log(elements);
  };
  const onConnect = (params: any) => {
    setElements([
      ...addEdge(
        { ...params, type: "buttonedge", data: { label: "" } },
        elements
      ),
    ]);
  };
  const onNodeDragStop = (event: any, node: any) => {
    let elementsTmp = diagram.elements.slice();
    elementsTmp[parseInt(node.id) - 1] = node;
    // let diagramTmp = Object.assign({}, diagram)
    // diagramTmp["elements"] = elementsTmp
    setElements(elementsTmp);
  };
  const onElementClick = (event: any, element: any) =>
    console.log("click", element);
  // Fit view on mounted
  useEffect(() => {
    if (reactflowInstance && elements && elements.length > 0) {
      reactflowInstance.fitView();
    }
  }, [reactflowInstance]);

  useEffect(() => {
    if (reactflowInstance) {
      setDiagram(reactflowInstance.toObject());
    }
    if (isInitialMount && isInitialMount.current < 2) {
      isInitialMount.current += 1;
    }
  }, [elements]);

  return (
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      style={{ background: bgColor }}
      onLoad={onLoad}
      nodeTypes={nodeTypes}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      edgeTypes={edgeTypes}
      snapGrid={snapGrid as [number, number]}
      defaultZoom={1.5}
    >
      <MiniMap
        nodeStrokeColor={(n: any) => {
          if (n.type === "input") return "#0041d0";
          if (n.type === "selectorNode") return bgColor;
          if (n.type === "output") return "#ff0072";
        }}
        nodeColor={(n) => {
          if (n.type === "selectorNode") return "#d9bbb3";
          return "#d9bbb3";
        }}
      />
      <Controls>
        {/* Add node button */}
        <ControlButton
          onClick={(e) => {
            addNode();
          }}
        >
          ⬜
        </ControlButton>
        {/* Save Button */}
        <ControlButton
          onClick={() => {
            // If diagram changed
            if (isInitialMount && isInitialMount.current === 2) {
              // Edit firestore diagram info
              axios
                .post(`https://ollim.herokuapp.com/editDiagram`, {
                  diagram: JSON.stringify(diagram),
                  genre,
                  writingDocID,
                })
                .then((res) => {
                  timer && clearTimeout(timer);
                  setAlarm(res.data);
                  isInitialMount.current = 0;
                  const dum = setTimeout(() => {
                    setAlarm(["", "success", false]);
                    setAlarmTimer(null);
                  }, 2000);
                  setAlarmTimer(dum);
                });
              // If nothing has changed, Alarm "there is no changed"
            } else {
              timer && clearTimeout(timer);
              setAlarm(["인물 관계도의 변경이 없습니다", "info", true]);
              const dum = setTimeout(() => {
                setAlarm(["", "success", false]);
                setAlarmTimer(null);
              }, 2000);
              setAlarmTimer(dum);
            }
          }}
        >
          <span className="material-icons">save</span>
        </ControlButton>
      </Controls>
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default DiagramWrite;
