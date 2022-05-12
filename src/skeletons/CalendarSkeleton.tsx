import CalendarElementSkeleton from "./CalendarElementSkeleton";

interface props {
  widthSize: number;
}
const CalendarSkeleton: React.FC<props> = ({ widthSize }) => {
  const recent3MonthsCommits = Array.from({ length: 3 }, () => 0);
  return (
    <>
      {widthSize > 500 ? (
        <div className="w-2/3 my-10 grid grid-cols-3 gap-4">
          {recent3MonthsCommits.map((v, idx) => (
            <CalendarElementSkeleton key={`${idx}_calendarElement`} />
          ))}
        </div>
      ) : (
        <div className="w-2/3 flex items-center justify-center">
          {recent3MonthsCommits && (
            <CalendarElementSkeleton key="widthSize<=500" />
          )}
        </div>
      )}
    </>
  );
};

export default CalendarSkeleton;
