import moment from "moment";
import { useEffect, useState } from "react";
import CalendarElement from "./CalendarElement";

interface props {
  totalCommits: { [key: number]: string };
  widthSize: number;
}

// Display works that commited in recent 3 months.
const Calendar: React.FC<props> = ({ totalCommits, widthSize }) => {
  const [recent3MonthsCommits, setRecent3MonthsCommits] = useState<{
    [key: string]: number[];
  }>({});

  // Build calander
  useEffect(() => {
    const initial = () => {
      // Caculate date ...
      const twoMonthsBeforeMonth = moment().subtract(2, "months").month() + 1;
      const twoMonthsBeforeYear = moment().subtract(2, "months").year();
      const twoMonthsBeforeStartDayUnix = moment().subtract(2, "months").startOf("month").valueOf()

      const currentMonth = [];
      const oneMonthBefore = [];
      const twoMonthBefore = [];

      const oneMonthsBeforeStartDayUnix = moment().subtract(1, "months").startOf("month").valueOf()

      const currentMonthFirstDayUnix = moment().startOf("month").valueOf()
      const currentMonthLastDayUnix = moment().endOf("month").valueOf()

      const commits = Object.keys(totalCommits);

      for (let i = 0; i < commits.length; i++) {
        let commitTimeInUnix = parseInt(commits[i]);
        if (
          currentMonthLastDayUnix >= commitTimeInUnix &&
          commitTimeInUnix >= currentMonthFirstDayUnix
        ) {
          currentMonth.push(commitTimeInUnix);
        } else if (
          currentMonthFirstDayUnix > commitTimeInUnix &&
          commitTimeInUnix >= oneMonthsBeforeStartDayUnix
        ) {
          oneMonthBefore.push(commitTimeInUnix);
        } else if (
          oneMonthsBeforeStartDayUnix > commitTimeInUnix &&
          commitTimeInUnix >= twoMonthsBeforeStartDayUnix
        ) {
          twoMonthBefore.push(commitTimeInUnix);
        }
      }

      const recent3MonthsCommitsTmp: any = {};
      recent3MonthsCommitsTmp[`${twoMonthsBeforeYear}-${twoMonthsBeforeMonth}`] = twoMonthBefore;
      recent3MonthsCommitsTmp[
        `${moment().subtract(1, "months").year()}-${moment().subtract(1, "months").month() + 1
        }`
      ] = oneMonthBefore;
      recent3MonthsCommitsTmp[`${moment().format("YYYY-MM")}`] = currentMonth;

      setRecent3MonthsCommits(recent3MonthsCommitsTmp);
    };

    if (totalCommits) {
      initial();
    }
  }, [totalCommits]);

  return (
    <>
      {widthSize > 500 ? (
        <div className="w-2/3 my-10 grid grid-cols-3 gap-4">
          {Object.keys(recent3MonthsCommits).length &&
            Object.keys(recent3MonthsCommits).map((commitsChunk) => (
              <CalendarElement
                key={commitsChunk}
                yearMonth={commitsChunk}
                keys={recent3MonthsCommits[commitsChunk]}
                totalCommits={totalCommits}
              />
            ))}
        </div>
      ) : (
        <div className="w-2/3 flex items-center justify-center">
          {Object.keys(recent3MonthsCommits).length && (
            <CalendarElement
              key={
                Object.keys(recent3MonthsCommits)[
                Object.keys(recent3MonthsCommits).length - 1
                ]
              }
              yearMonth={
                Object.keys(recent3MonthsCommits)[
                Object.keys(recent3MonthsCommits).length - 1
                ]
              }
              keys={
                recent3MonthsCommits[
                Object.keys(recent3MonthsCommits)[
                Object.keys(recent3MonthsCommits).length - 1
                ]
                ]
              }
              totalCommits={totalCommits}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Calendar;
