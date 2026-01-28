// components/checkout/ProcessingOverlay.tsx
export default function ProcessingOverlay({ status }: { status: string }) {
    return (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md text-white px-4">
            <div className="relative">
                {/* Outer Spinning Ring */}
                <div className="w-24 h-24 border-4 border-slate-400/30 border-t-red-500 rounded-full animate-spin"></div>
                
                {/* Inner Pulsing Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl animate-pulse">💳</span>
                </div>
            </div>

            {/* Fixed the tag mismatch here */}
            <h2 className="mt-8 text-2xl font-black tracking-tight uppercase text-center">
                {status}
            </h2>
            
            <p className="mt-2 text-slate-300 animate-pulse text-center">
                Please do not refresh or close this window.
            </p>
            
            {/* Progress Bar Container */}
            <div className="mt-6 w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                {/* If you haven't added the custom animation to tailwind.config yet, 
                    this will just show a static red bar. */}
                <div className="h-full bg-red-500 animate-[loading-bar_2s_infinite_linear]"></div>
            </div>
        </div>
    );
}