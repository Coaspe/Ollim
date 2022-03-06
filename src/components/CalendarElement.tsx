import { useEffect, useState} from "react"
import moment from 'moment'
import CalendarElementNode from "./CalendarElementNode"
interface props {
    yearMonth: string
    keys: number[]
    totalCommits: {[key:number] : string}
}
const CalendarElement: React.FC<props> = ({ yearMonth, keys, totalCommits }) => {
    const [elementCommits, setElementCommits] = useState<{ [key: number]: string[] }>({})


    useEffect(() => {
        if (yearMonth && keys && totalCommits) {
            console.log("CalendarElement", totalCommits);
            const tmp: { [key: number]: string[] } = {}
    
            Array.from(Array(moment(yearMonth, "YYYY-MM").daysInMonth()).keys()).forEach((date)=>(tmp[date+1] = []))

            keys.forEach((date) => {
                tmp[moment(date).date()] = [...tmp[moment(date).date()], totalCommits[date]]
            })
            
            setElementCommits(tmp)
        }
        
    }, [keys])

    return (
        <>
            {elementCommits &&
                <div className="flex flex-col items-center font-bold">
                    <span className="text-sm mb-3">{yearMonth}</span>
                    <div style={{borderColor: "#c0c0c0"}} className="w-3/4 px-2 py-2 border gap-3 grid grid-cols-7 place-items-center rounded-lg">
                        {Object.keys(elementCommits).map((date) => (
                            <CalendarElementNode key={`${yearMonth}-${date}`} date={date} elementCommits={elementCommits} />
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default CalendarElement