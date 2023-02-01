import CalendarElementNodeSkeleton from "./CalendarElementNodeSkeleton";
const CalendarElementSkeleton = () => {
  const elementCommits = Array.from({ length: 30 }, () => 0);

  return (
    <>
      <div className="flex flex-col items-center font-bold GalaxyS20Ultra:w-full">
        <span className="text-sm mb-3 text-gray-400">0000-0</span>
        <div
          style={{ borderColor: "#c0c0c0" }}
          className="w-3/4 px-2 py-2 border gap-3 grid grid-cols-7 place-items-center rounded-lg"
        >
          {elementCommits.map((date, idx) => (
            <CalendarElementNodeSkeleton key={`${idx}-${date}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CalendarElementSkeleton;
