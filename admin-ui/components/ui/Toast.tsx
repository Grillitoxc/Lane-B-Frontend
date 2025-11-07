'use client';
import { useToast } from '@/hooks/useToast';
import { Snippet } from '@heroui/react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl px-4 py-3 shadow-xl border-2 flex items-center gap-3 min-w-[300px] animate-in slide-in-from-right ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex-1 font-medium">{toast.message}</div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
