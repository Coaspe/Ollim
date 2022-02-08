import { motion } from "framer-motion"
import { useEffect, useState, useRef, useCallback } from "react"
import ReactFlow,
{ Controls,removeElements, addEdge, updateEdge, Edge, Connection, Elements } from 'react-flow-renderer';
import CustomNodeFlow from "../CustomNodeFlow";

interface NewWritingProps {
    setNewWritingModalOpen:React.Dispatch<React.SetStateAction<boolean>>
}
const NewWritingModal: React.FC<NewWritingProps> = ({ setNewWritingModalOpen }) => {
    const [page, setPage] = useState(1)
    const yPos = useRef(0)
    const elementsId = useRef(3)
    const [genrn, setGenrn] = useState("")
    const [genrnError, setGenrnError] = useState(false)

    const [title, setTitle] = useState("")
    const [titleError, setTitleError] = useState(false)

    const [synopsis, setSynopsis] = useState("")

    useEffect(() => {
        document.body.style.overflow = "hidden"
        return ()=>{document.body.style.overflow = "visible"}
    }, [])

    const handleGenrnError = () => {
        genrnError && setGenrnError(false)
    }
    const handleTitleError = () => {
        titleError && setTitleError(false)
    }


    const initialElements = [
    {
        id: '1',
        type: 'input', // input node
        data: { label: '현수' },
        position: { x: 250, y: 25 },
    },
    // default node
    {
        id: '2',
        // you can also pass a React component as a label
        data: { label: "준식엄" },
        position: { x: 100, y: 125 },
    },
    {
        id: '3',
        type: 'output', // output node
        data: { label: '철수' },
        position: { x: 250, y: 250 },
    },

    { id: 'e1-2', source: '1', target: '2', label:"서로 형제", labelBgStyle:{ fill : "#faf6f5"}},
    { id: 'e2-3', source: '2', target: '3' },
    ];


    const [elements, setElements] = useState<any>(initialElements);

    const addNode = useCallback(() => {
        yPos.current += 50;
        elementsId.current += 1
        setElements((els: any) => {
        return [
            ...els,
            {
            id: elementsId,
            position: { x: 100, y: yPos.current },
            data: { label: "yo" }
            }
        ];
        });
    }, []);

    const onConnect = (params:  Edge<any> | Connection) => { setElements((els: any) => addEdge(params, els)) };
    const onElementsRemove = (elementsToRemove: Elements) => setElements((els: any) => removeElements(elementsToRemove, els));
    const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) =>setElements((els: any) => updateEdge(oldEdge, newConnection, els));
    const onElementClick = (event: React.MouseEvent<Element, MouseEvent>, element: any) => {
        console.log(element);
    }
    return (
        <motion.div onClick={() => {setNewWritingModalOpen(false)}} className="font-noto flex items-center justify-center z-20 fixed w-full h-full" animate={{ backgroundColor: ["hsla(0, 0%, 0%, 0)", "hsla(0, 0%, 0%, 0.8)"] }} transition={{ duration: 0.2, ease: "easeIn" }}>
            {/* First page: Decide Gerne, Title, Synopsis*/}
            {page === 1 && <div onClick={(e) => { e.stopPropagation() }} className="relative w-1/2 h-3/4 py-5 px-5 flex flex-col items-center rounded-xl bg-[#faf6f5]">
                <motion.svg whileHover={{ y: "-10%" }} x="0px" y="0px"
                    className={`w-6 absolute top-5 right-5 cursor-pointer`}
                    onClick={() => {
                        if (!genrn && !title) {
                            setGenrnError(true)
                            setTitleError(true)
                        } else if (!genrn) {
                            setGenrnError(true)
                            handleTitleError()
                        } else if (!title) {
                            setTitleError(true)
                            handleGenrnError()
                        } else {
                            setPage(2)
                        }
                    }}
                    viewBox="0 0 471.2 471.2">
                    <g>
                        <g>
                            <path d="M396.7,0H74.5C33.4,0,0,33.4,0,74.5v322.2c0,41.1,33.4,74.5,74.5,74.5h322.2c41.1,0,74.5-33.4,74.5-74.5V74.5
                                C471.2,33.5,437.7,0,396.7,0z M444.2,396.7c0,26.2-21.3,47.5-47.5,47.5H74.5c-26.2,0-47.5-21.3-47.5-47.5V74.5
                                C27,48.3,48.3,27,74.5,27h322.2c26.2,0,47.5,21.3,47.5,47.5V396.7z"/>
                            <path d="M283.6,155.6c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l47.5,47.5H126.6c-7.5,0-13.5,6-13.5,13.5
                                s6,13.5,13.5,13.5H312l-47.4,47.4c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l70.5-70.5c5.3-5.3,5.3-13.8,0-19.1
                                L283.6,155.6z"/>
                        </g>
                    </g>
                </motion.svg>

                {/* Genrn div */}
                <div className="flex flex-col items-start justify-between w-3/4">
                    <div className="flex items-center">
                        <span className="text-2xl font-black">장르</span>
                        {genrnError && <motion.span className="text-sm ml-2 font-bold text-red-400" animate={{ opacity: [0, 1] }} transition={{ duration: 0.1 }}>장르를 선택해주세요!</motion.span>}
                    </div>
                    <div className="flex items-center justify-between mt-5 w-1/2">
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "novel" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("novel")
                                handleGenrnError()
                            }}>소설</span>
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "poem" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("poem")
                                handleGenrnError()
                            }}>시</span>
                        <span className={`text-md font-bold cursor-pointer border border-[#e4d0ca] py-2 px-3 rounded-full hover:bg-[#f2e3de] ${genrn === "scenario" && "bg-[#f5e1db]"}`}
                            onClick={() => {
                                setGenrn("scenario")
                                handleGenrnError()
                            }}>시나리오</span>
                    </div>
                </div>

                {/* Title, Description div */}
                <div className="mt-10 flex flex-col items-start w-3/4">
                    <div className="flex items-center">
                        <span className="text-2xl font-black">제목</span>
                        {titleError && <motion.span className="text-sm ml-2 font-bold text-red-400" animate={{ opacity: [0, 1] }} transition={{ duration: 0.1 }}>제목을 입력해주세요!</motion.span>}
                    </div>
                    <input className="text-lg font-md border-2 border-[#e4d0ca] py-2 px-3 mt-5 rounded-xl w-1/2 "
                        placeholder="제목을 입력해주세요"
                        type="text"
                        onChange={(e) => {
                            setTitle(e.target.value)
                            e.target.value && handleTitleError()
                        }} />
                </div>

                {/* Opening article div */}
                <div className="mt-10 flex flex-col items-start w-3/4">
                    <span className="text-2xl font-black">시놉시스</span>
                    <textarea className="resize-none border-2 border-[#e4d0ca] py-2 px-3 mt-5 rounded-xl h-28 w-full italic" placeholder="간략한 줄거리를 서술해주세요." spellCheck="false" onChange={(e) => { setSynopsis(e.target.value) }} />
                </div>
            </div>}

            {/* (if Novel and Scenario) Second page: Decide Characters relationships diagram */}
            {page === 2 &&
            <div onClick={(e) => { e.stopPropagation() }} className="relative w-1/2 h-3/4 py-5 px-5 flex flex-col items-center rounded-xl bg-[#faf6f5]">
                <CustomNodeFlow />
                {/* <ReactFlow 
                elements={elements} 
                onConnect={onConnect} 
                onElementsRemove={onElementsRemove} 
                onEdgeUpdate={onEdgeUpdate} 
                onElementClick={onElementClick}>
                    <Controls />
                </ReactFlow> */}
            </div>}           
        </motion.div>
    )
}

export default NewWritingModal