const FollowersFollowingsSkeleton = () => {
    return (
        <>
            {Array(5).fill(0).map((data, index) => (
                <div key={index} className="flex items-center w-full shadow-lg px-2 py-1 rounded-2xl">
                    <div className="w-7 h-7 rounded-full animate-pulse bg-slate-200" />
                    <span className="ml-3 text-slate-200 bg-slate-200 animate-pulse rounded-2xl">아아아아아아아아</span>
                </div>
            ))}
        </>
    )
}

export default FollowersFollowingsSkeleton;