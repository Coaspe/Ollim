import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  isEdge,
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  ControlButton,
  Elements,
  Position,
} from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';

import ColorSelectorNode from './ColorSelectorNode';
import { elementsAction } from './redux';
import { RootState } from './redux/store';

const onNodeDragStop = (event:any, node:any) => console.log('drag stop', node);
const onElementClick = (event:any, element:any) => console.log('click', element);

const initBgColor = '#faf6f5';

const connectionLineStyle = { stroke: '#000' };
const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
};

const CustomNodeFlow = () => {
  const [reactflowInstance, setReactflowInstance] = useState<any>(null);
  const [bgColor, setBgColor] = useState<any>(initBgColor);
  const dispatch = useDispatch()
  const elements: Elements<any> = useSelector((state: RootState) => state.setElements.elements)
  const setElements = useCallback((elements: Elements<any>) => {
      dispatch(elementsAction.setElements({elements: elements}))
  }, [dispatch])

  const onConnect = (params: any) => {
      setElements(
        [...addEdge({ ...params, animated: true, style: { stroke: '#000' } }, elements)]
      )
    }
  const onLoad = useCallback(
    (rfi) => {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
        console.log('flow loaded:', rfi);
        console.log('flow loaded:', rfi.getElements());
      }
    },
    [reactflowInstance]
  );

  useEffect(() => {
    const onChange = (event: any, id: number) => {
      const tmp = elements.map((e: any) => {
        if (isEdge(e) || e.id !== id) {
          return e;
        }

        const desc = event.target.value;

        return {
          ...e,
          data: {
            ...e.data,
            desc
          },
        };
      })
      setElements([...tmp]);
    };
    const onLabelChange = (event: any, id: number) => {
      const tmp = elements.map((e: any) => {
        if (isEdge(e) || e.id !== id) {
          return e;
        }

        const label = event.target.value;

        return {
          ...e,
          data: {
            ...e.data,
            label
          },
        };
      })
      setElements([...tmp]);
    }
    setElements([
      {
        id: '1',
        type: 'input',
        data: { label: 'An input node' },
        position: { x: 0, y: 50 },
        sourcePosition: Position.Right,
      },
      {
        id: '2',
        type: 'selectorNode',
        dragHandle: '.custom-drag-handle',
        data: { onChange, onLabelChange, color: initBgColor, label: "민수", desc: "그는 겁이 많습니다."},
        position: { x: 300, y: 50 },
      },
      {
        id: '3',
        type: 'output',
        data: { label: 'Output A' },
        position: { x: 650, y: 25 },
        targetPosition: Position.Left,
      },
      {
        id: '4',
        type: 'output',
        data: { label: 'Output B' },
        position: { x: 650, y: 100 },
        targetPosition: Position.Left,
      },

      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        style: { stroke: '#000' },
      },
      {
        id: 'e2a-3',
        source: '2',
        target: '3',
        sourceHandle: 'a',
        animated: true,
        style: { stroke: '#000' },
      },
      {
        id: 'e2b-4',
        source: '2',
        target: '4',
        sourceHandle: 'b',
        animated: true,
        style: { stroke: '#000' },
      },
    ]);
  }, []);

  useEffect(() => {
    if (reactflowInstance && elements.length > 0) {
      reactflowInstance.fitView();
    }
  }, [reactflowInstance, elements.length]);

  useEffect(() => {
    console.log(elements);
  },[elements])


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
      snapGrid={snapGrid as [number, number]}
      defaultZoom={1.5}
    >
      <MiniMap
        nodeStrokeColor={(n:any) => {
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'selectorNode') return bgColor;
          if (n.type === 'output') return '#ff0072';
        }}
        nodeColor={(n) => {
          if (n.type === 'selectorNode') return bgColor;
          return '#fff';
        }}
      />
      <Controls>
        <ControlButton onClick={() => console.log('action')}>
          N
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
};

export default CustomNodeFlow;