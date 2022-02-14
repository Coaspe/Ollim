import { Jodit } from "jodit";
import JoditEditor from "../JoditEditor";
import { useEffect, useMemo, useRef, useState } from "react";
import './editor.css'

interface EditorProps {
    textProps: string
    setOpenDiagram: React.Dispatch<React.SetStateAction<boolean>>
    isFull: boolean
    setIsFull: React.Dispatch<React.SetStateAction<boolean>>
}

const Editor: React.FC<EditorProps> = ({ textProps, setOpenDiagram }) => {
    const [text, setText] = useState(textProps)
    const textArea = useRef<any>(null)
    const [searchWord, setSearchWord] = useState("")
    const [joditState, setJoditState] = useState<Jodit>({} as Jodit)
    const config = {
        controls: {
            font: {
                list: Jodit.atom({
                    'Noto Serif KR': '나눔 명조'
                })
            }
        },
        events:
        {
            afterInit: (instance: Jodit) => {
                // equal to jodit.make(#editor)
                setJoditState(instance)
                
                // instance.s.insertHTML(`<span style="color:red">sefsefsef</span>`)
            }
        }
        ,
        language: 'ko',
        spellcheck: true,
        allowResizeY: true,
        width:"80%",
        height: "100%",
        toolbarAdaptive: false,
        readonly: false,
        style: {
            padding: 10,
            backgroundColor: "#f4f1e6",
        },
        "buttons": ["bold", "lineHeight", "italic", "underline", "strikethrough", "|", "eraser", "ul", "ol", "indent", "outdent", "left", "|", "font", "fontsize", "superscript", "subscript", "\n", "fullsize", "undo", "redo", "preview", "source", "cut", {
            iconURL: '/diagram.svg',
            exec: (editor: Jodit) => {
                setOpenDiagram((origin) => !origin)
            }
        },
            {
            iconURL: '/dict.svg',
            exec: (editor: Jodit) => {
                const handleClick = () => {
                   editor.selection.sel?.toString() ? window.open(`https://opendict.korean.go.kr/small/searchResult?query=${editor.selection.sel?.toString()}`,"_blank", "width=450,height=600") : window.open("https://opendict.korean.go.kr/small/main","_blank", "width=450,height=600");
                };
                handleClick()
            },
            tooltip: "사전 검색"
            },
        ]
    };
    useEffect(() => {
        return ()=>{setOpenDiagram(false)}
    }, [joditState])

    // The problem is onChange always re-render the state. So when re-render the focus will be lost.
    // I have a solution to avoid this problem. Use useMemo hooks to solve this.
    return useMemo(() => (
        <JoditEditor
            ref={textArea}
            value={text}
            config={config}
            onDrag={(content, visible) => {
                console.log("Editor", visible);
                setSearchWord(content)
            }}
            onChange={content => {
                setText(content)
            }}
        />), [])
}

export default Editor