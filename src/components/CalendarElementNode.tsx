import { Tooltip } from "@mui/material"
import Zoom from '@mui/material/Zoom';
import {memo} from 'react'
interface props {
    date: string
    elementCommits: { [key: number]: string[] }
}
const CalendarElementNode: React.FC<props> = ({ date, elementCommits }) => {
    console.log(elementCommits[parseInt(date)]);
    
    type bgColorType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    const bgColor = {
        1: "rgb(251 207 232)",
        2: "rgb(249 168 212)",
        3: "rgb(244 114 182)",
        4: "rgb(236 72 153)",
        5: "rgb(219 39 119)",
        6: "rgb(190 24 93)",
        7: "rgb(157 23 77)",
        8: "rgb(131 24 67)",
    }

    return (
    <>
        {elementCommits[parseInt(date)].length > 0 ? 
        <Tooltip title={`${parseInt(date)}일 ${`- ${elementCommits[parseInt(date)]}`}`} placement="top" arrow TransitionComponent={Zoom} TransitionProps={{ timeout: 300 }}>
            <div style={{backgroundColor: elementCommits[parseInt(date)].length <= 8 ? bgColor[elementCommits[parseInt(date)].length as bgColorType] : bgColor[8], width: "80%", aspectRatio: "1/1"}} className={`text-sm border border-gray-400 shadow-sm rounded-md flex items-center justify-center`} />
        </Tooltip> :
        <div style={{backgroundColor: elementCommits[parseInt(date)].length <= 8 ? bgColor[elementCommits[parseInt(date)].length as bgColorType] : bgColor[8], width: "80%", aspectRatio: "1/1"}} className={`text-sm border border-gray-400 shadow-sm rounded-md flex items-center justify-center`} />
        }
    </>
    )
}

export default memo(CalendarElementNode)