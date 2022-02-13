import { Jodit } from "jodit";
import JoditEditor from "jodit-react";
import { useEffect, useMemo, useState } from "react";
import { Elements } from "react-flow-renderer";
import './editor.css'

interface EditorProps {
    textProps: string
    setOpenDiagram: React.Dispatch<React.SetStateAction<boolean>>
}

const Editor: React.FC<EditorProps> = ({ textProps, setOpenDiagram }) => {
    const [text, setText] = useState(textProps)
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
                console.log(instance);
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
                setOpenDiagram((origin)=>!origin)
            }
        }]
    };
    useEffect(() => {
        return ()=>{setOpenDiagram(false)}
    },[text])
    // The problem is onChange always re-render the state. So when re-render the focus will be lost.
    // I have a solution to avoid this problem. Use useMemo hooks to solve this.
    return useMemo(() => (
        <JoditEditor
            value={text}
            config={config}
            onBlur={content => { console.log(content) }}
            onChange={content => {
                setText(content)
            }}
        />), [])
}

export default Editor