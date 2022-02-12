import moment from 'moment';
import { useEffect, useState } from "react";
import CalendarElement from "./CalendarElement";

interface props {
    totalCommits: {[key:number] : string}
}
const Calendar: React.FC<props> = ({ totalCommits }) => {
    const [recent3MonthsCommits, setRecent3MonthsCommits] = useState<{[key:string]: number[]}>({})
    
    useEffect(() => {
        const initial = () => {
            const twoMonthsBeforeMonth = moment().subtract(2, 'months').month() + 1
            const twoMonthsBeforeYear = moment().subtract(2, 'months').year()
            const twoMonthsBeforeUnix = moment(`${twoMonthsBeforeYear}-${twoMonthsBeforeMonth}-1`).valueOf()

            const current = []
            const oneMonthBefore = []
            const twoMonthBefore = []
    
            const oneMonthsBeforeUnix = moment(`${moment().subtract(1, 'months').year()}-${moment().subtract(1, 'months').month() + 1}-1`).valueOf()
            const currentMonthLastDayUnix = moment(`${moment().year()}-${moment().month() + 1}-${moment().daysInMonth()}`).valueOf()
            const currentMonthFirstDayUnix = moment(`${moment().year()}-${moment().month() + 1}-1`).valueOf()
            
            const tmp = Object.keys(totalCommits).reverse()
    
            for (let i = 0; i < tmp.length; i++) {
                let tmpInt = parseInt(tmp[i])
                if (currentMonthLastDayUnix >= tmpInt && tmpInt >= currentMonthFirstDayUnix) {
                    current.push(tmpInt)
                } else if (currentMonthFirstDayUnix > tmpInt && tmpInt >= oneMonthsBeforeUnix) {
                    oneMonthBefore.push(tmpInt)
                } else if (oneMonthsBeforeUnix > tmpInt && tmpInt >= twoMonthsBeforeUnix) {
                    twoMonthBefore.push(tmpInt)
                } else if (twoMonthsBeforeUnix > tmpInt) {
                    break
                }
            }

            const tmp2: any = {}
            tmp2[`${twoMonthsBeforeYear}-${twoMonthsBeforeMonth}`] = twoMonthBefore
            tmp2[`${moment().subtract(1, 'months').year()}-${moment().subtract(1, 'months').month() + 1}`] = oneMonthBefore
            tmp2[`${moment().format("YYYY-MM")}`] = current

            setRecent3MonthsCommits(tmp2)
        }
        if (totalCommits) {
            initial()
        }
    },[totalCommits])
    return (
        <div className="w-2/3 my-10 grid grid-cols-3 gap-4">
            {recent3MonthsCommits &&
                Object.keys(recent3MonthsCommits).map((commitsChunk) => (
                    <CalendarElement key={commitsChunk} yearMonth={commitsChunk} keys={recent3MonthsCommits[commitsChunk]} totalCommits={totalCommits} />
                ))}
        </div>
    )
}

export default Calendar