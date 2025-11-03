import { useEffect, useState } from "react";

export default function Toast({ id, message, type = "info", duration = 2500, action = null, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // enter
    setVisible(true);
    const enterTimer = setTimeout(() => {}, 300);
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    // auto close
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose && onClose(id), 300);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, id, onClose]);

  const bg = type === "success" ? "bg-indigo-600" : type === "error" ? "bg-red-600" : "bg-gray-800";
  const icon =
    type === "success" ? (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : type === "error" ? (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ) : (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
      </svg>
    );

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose && onClose(id), 300);
  };

  return (
    <div className={`transform transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
      <div className={`${bg} text-white px-4 py-2 rounded-md shadow-md flex items-center gap-3`}> 
        <div className="shrink-0">{icon}</div>
        <div className="text-sm">{message}</div>
        {action && (
          <button
            onClick={() => {
              try {
                action.onAction && action.onAction();
              } catch (e) {
                // ignore
              }
              handleClose();
            }}
            className="ml-3 bg-white/10 px-3 py-1 rounded text-sm hover:bg-white/20"
          >
            {action.label || 'Action'}
          </button>
        )}
        <button onClick={handleClose} className="ml-3 text-white/80 hover:text-white focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
