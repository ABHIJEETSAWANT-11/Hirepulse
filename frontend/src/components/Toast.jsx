import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

let listeners = [];
let idCounter = 0;

/** Fire a toast from anywhere: toast("Saved"), toast.success("..."), toast.error("...") */
export function toast(message, opts = {}) {
  const item = {
    id: ++idCounter,
    message,
    type: opts.type || "info",
    duration: opts.duration ?? 3800,
  };
  listeners.forEach((l) => l(item));
}

toast.success = (msg, opts = {}) => toast(msg, { ...opts, type: "success" });
toast.error = (msg, opts = {}) => toast(msg, { ...opts, type: "error" });

export function ToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const onToast = (item) => {
      setItems((prev) => [...prev, item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== item.id));
      }, item.duration);
    };
    listeners.push(onToast);
    return () => {
      listeners = listeners.filter((l) => l !== onToast);
    };
  }, []);

  const iconFor = (type) =>
    type === "success" ? (
      <CheckCircle2 size={16} strokeWidth={1.8} className="text-primary" />
    ) : type === "error" ? (
      <AlertTriangle size={16} strokeWidth={1.8} className="text-[#B91C1C]" />
    ) : (
      <Info size={16} strokeWidth={1.8} className="text-primary" />
    );

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-black/8 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.10)] animate-[toast-in_200ms_ease-out]"
          style={{ minWidth: 280, maxWidth: 380 }}
        >
          <span className="mt-0.5 shrink-0">{iconFor(t.type)}</span>
          <p className="text-[13px] leading-snug text-ink">{t.message}</p>
          <button
            aria-label="Dismiss"
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
            className="ml-auto shrink-0 text-black/30 hover:text-black/60 transition-colors"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}
