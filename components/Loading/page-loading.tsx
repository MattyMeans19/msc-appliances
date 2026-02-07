
interface Page{
    current: string
}

export default function LoadingPage({current}: Page){
    return(
<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-400/30 backdrop-blur-sm text-5xl">
    {/* Use a flex container for the text so the dots don't jump around */}
    <div className="flex items-baseline gap-1">
        <p className="font-semibold text-slate-800">
            Loading {current}
        </p>
        <span className="ml-10 animate-shake animate-infinite text-red-500 font-bold">
            ...
        </span>
    </div>
</div>
    )
}