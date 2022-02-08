import JoditEditor from "jodit-react";
import { useMemo } from "react";
interface EditorProps {
    text: string
    setText: React.Dispatch<React.SetStateAction<string>>
}
const Editor:React.FC<EditorProps> = ({text, setText}) => {
    const config = {
        controls: {
            font: {
                list: {
                    'Noto Serif KR,serif': '나눔명조'
                }
            }
        },
        language: 'ko'
    };

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