import { CheckCircle2, ShieldAlert, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function AlertComponent({
    message = "Username atau password salah.",
    type = "error",
    onClose,
}) {
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onCloseRef.current?.();
        }, type === "success" ? 2500 : 2000);
        return () => clearTimeout(timer);
    }, [message, type]);

    const isSuccess = type === "success";

    return (
        <div className="fixed top-5 right-5 z-[999] animate-in slide-in-from-top-5">
            <div
                className={`relative flex w-[350px] items-center gap-3 rounded-2xl border bg-white p-4 shadow-xl ${
                    isSuccess ? "border-green-200" : "border-red-200"
                }`}
            >
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        isSuccess ? "bg-green-100" : "bg-red-100"
                    }`}
                >
                    {isSuccess ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                    )}
                </div>

                <div className="flex-1 pr-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                        {message}
                    </h3>
                </div>

                <button
                    onClick={() => onClose?.()}
                    className="absolute top-1 right-2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
