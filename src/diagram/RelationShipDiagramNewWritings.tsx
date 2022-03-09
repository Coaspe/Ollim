import { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  ControlButton,
  Background,
} from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import ColorSelectorNode from './RelationShipDiagramNode';
import { diagramAction, elementsAction } from '../redux';
import { RootState } from '../redux/store';
import ButtonEdge from './ButtonEdge';

const initBgColor = '#faf6f5';
const edgeTypes = {
  buttonedge: ButtonEdge,
};
const connectionLineStyle = { stroke: '#000' };
const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
};

const DiagramNewWritings= () => {
  const [reactflowInstance, setReactflowInstance] = useState<any>(null);
  const pos = useRef([10, 10])

  const dispatch = useDispatch();
  const elements = useSelector((state: RootState) => state.setElements.elements);
  const setElements = useCallback(
    (elements) => {
      dispatch(elementsAction.setElements({ elements: elements }));
    },
    [dispatch]
  );
  const setDiagram = useCallback(
      (diagram) => {
      dispatch(diagramAction.setDiagram({ diagram }));
      },
      [dispatch]
  );
  const diagram = useSelector((state: RootState) => state.setDiagram.diagram)
  
  const onLoad = useCallback(
    (rfi) => {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
      }
    },
    [reactflowInstance]
  );

  const addNode = () => {

    let num = 0
    elements.forEach((data) => { data.type && (num += 1) })
    
    const addedNode = {
      id: (num + 1).toString(),
      type: 'selectorNode',
      dragHandle: '.custom-drag-handle',
      data: { color: initBgColor, label: "", desc: ""},
      position: { x: pos.current[0], y: pos.current[1] },
    }
    pos.current[0] += 10
    pos.current[1] += 10
    setElements([...elements, addedNode])
  }

  const onConnect = (params: any) => {
      setElements(
        [...addEdge({ ...params, type: 'buttonedge', data: { label: "" } }, elements)]
      )
  }

  const onNodeDragStop = (event: any, node: any) => {
    let elementsTmp = diagram.elements.slice()
    elementsTmp[(parseInt(node.id) - 1)] = node
    setElements(elementsTmp)
  };
    // Fit view on mounted
    useEffect(() => {
      if (reactflowInstance) {
        reactflowInstance.fitView();
      }
    }, [reactflowInstance]);
  
  useEffect(() => {
      if (reactflowInstance) {
        setDiagram(reactflowInstance.toObject());
      }
  }, [elements])
  
  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      style={{ background: initBgColor }}
      onLoad={onLoad}
      nodeTypes={nodeTypes}
      connectionLineStyle={connectionLineStyle}
      snapToGrid={true}
      edgeTypes={edgeTypes}
      snapGrid={snapGrid as [number, number]}
      defaultZoom={1.5}
    >
      <MiniMap
        nodeStrokeColor={(n:any) => {
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'selectorNode') return initBgColor as any;
          if (n.type === 'output') return '#ff0072';
        }}
        nodeColor={(n) => {
          if (n.type === 'selectorNode') return "#d9bbb3";
          return '#d9bbb3';
        }}
      />
      <Controls>
        {/* Add node button */}
        <ControlButton onClick={(e) => {
          addNode()
        }}>
          ⬜
        </ControlButton>
      </Controls>
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default DiagramNewWritings;