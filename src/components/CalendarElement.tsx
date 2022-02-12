import { memo, useEffect, useState } from "react"
import moment from 'moment'
import { Tooltip } from "@mui/material"
import Zoom from '@mui/material/Zoom';

interface props {
    yearMonth: string
    keys: number[]
    totalCommits: {[key:number] : string}
}
const CalendarElement: React.FC<props> = ({ yearMonth, keys, totalCommits }) => {
    const [elementCommits, setElementCommits] = useState<{ [key: number]: string[] }>({})
    type bgColorType = 1| 2 | 3 | 4 | 5 | 6 | 7 | 8
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
    useEffect(() => {
        if (yearMonth && keys && totalCommits) {
            console.log(yearMonth, keys, totalCommits);
            const tmp: { [key: number]: string[] } = {}
    
            Array.from(Array(moment(yearMonth, "YYYY-MM").daysInMonth()).keys()).forEach((date)=>(tmp[date+1] = []))

            keys.forEach((date) => {
                tmp[moment(date).date()] = [...tmp[moment(date).date()], totalCommits[date]]
            })
            
            setElementCommits(tmp)
        }
    }, [totalCommits])

    return (
        <>
            {elementCommits && 
                <div className="flex flex-col items-center font-bold">
                    <span className="text-sm mb-3">{yearMonth}</span>
                    <div className="w-3/4 px-2 py-2 border gap-3 border-[#c0c0c0] grid grid-cols-7 place-items-center rounded-lg">
                        {Object.keys(elementCommits).map((data) => (
                            <Tooltip key={`${yearMonth}-${data}`} title={`${parseInt(data)}일 - ${elementCommits[parseInt(data)]}`} placement="top" arrow TransitionComponent={Zoom} TransitionProps={{ timeout: 300 }}>
                                <div style={{backgroundColor: bgColor[elementCommits[parseInt(data)].length as bgColorType]}} className={`text-sm w-5 h-5 border border-gray-400 shadow-lg shadow-[#FBCFE8] rounded-md flex items-center justify-center`} />
                            </Tooltip>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default memo(CalendarElement)