import moment from "moment";
import { useEffect, useState } from "react";
import CalendarElement from "./CalendarElement";

interface props {
  totalCommits: { [key: number]: string };
  widthSize: number;
}
const Calendar: React.FC<props> = ({ totalCommits, widthSize }) => {
  const [recent3MonthsCommits, setRecent3MonthsCommits] = useState<{
    [key: string]: number[];
  }>({});

  useEffect(() => {
    const initial = () => {
      const twoMonthsBeforeMonth = moment().subtract(2, "months").month() + 1;
      const twoMonthsBeforeYear = moment().subtract(2, "months").year();
      const twoMonthsBeforeUnix = moment(
        `${twoMonthsBeforeYear}-${twoMonthsBeforeMonth}-1`
      ).valueOf();

      const currentMonth = [];
      const oneMonthBefore = [];
      const twoMonthBefore = [];

      const oneMonthsBeforeUnix = moment(
        `${moment().subtract(1, "months").year()}-${moment().subtract(1, "months").month() + 1
        }-1`
      ).valueOf();
      const currentMonthLastDayUnix = moment(
        `${moment().year()}-${moment().month() + 1 + 1}-1`
      ).valueOf() - 1;
      const currentMonthFirstDayUnix = moment(
        `${moment().year()}-${moment().month() + 1}-1`
      ).valueOf();

      const tmp = Object.keys(totalCommits);

      for (let i = 0; i < tmp.length; i++) {
        let tmpInt = parseInt(tmp[i]);
        if (
          currentMonthLastDayUnix >= tmpInt &&
          tmpInt >= currentMonthFirstDayUnix
        ) {
          currentMonth.push(tmpInt);
        } else if (
          currentMonthFirstDayUnix > tmpInt &&
          tmpInt >= oneMonthsBeforeUnix
        ) {
          oneMonthBefore.push(tmpInt);
        } else if (
          oneMonthsBeforeUnix > tmpInt &&
          tmpInt >= twoMonthsBeforeUnix
        ) {
          twoMonthBefore.push(tmpInt);
        } else if (twoMonthsBeforeUnix > tmpInt) {
          continue;
        }
      }

      const tmp2: any = {};
      tmp2[`${twoMonthsBeforeYear}-${twoMonthsBeforeMonth}`] = twoMonthBefore;
      tmp2[
        `${moment().subtract(1, "months").year()}-${moment().subtract(1, "months").month() + 1
        }`
      ] = oneMonthBefore;
      tmp2[`${moment().format("YYYY-MM")}`] = currentMonth;

      setRecent3MonthsCommits(tmp2);

    };

    if (totalCommits) {
      initial();
    }
  }, [totalCommits]);

  return (
    <>
      {widthSize > 500 ? (
        <div className="w-2/3 my-10 grid grid-cols-3 gap-4">
          {recent3MonthsCommits &&
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
          {recent3MonthsCommits && (
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
