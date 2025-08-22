type DbLoadingProps = {
  message?: string;
  className?: string;
};

export default function DbLoading({ message = "Fetching data…", className = "" }: DbLoadingProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`w-full h-full flex items-center justify-center bg-transparent ${className}`}
      style={{ minHeight: 120 }}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Database cylinder */}
        <div className="relative w-20 h-24 flex flex-col items-center">
          {/* Top ellipse */}
          <div className="w-20 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-90"></div>
          {/* Body */}
          <div className="w-20 flex-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-lg shadow-md"></div>
        </div>

        {/* Dots moving across */}
        <div className="flex space-x-2 mt-4">
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>

        {/* Caption */}
        <p className="text-sm text-slate-700 font-medium">{message}</p>

        {/* Screen reader text */}
        <span className="sr-only">{message}</span>
      </div>
    </div>
  );
}
