import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useDashboard();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full sm:w-96">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all-custom animate-slide-in ${
            toast.type === 'warning'
              ? 'bg-amber-50/90 border-amber-200 text-amber-900 dark:bg-amber-950/90 dark:border-amber-800 dark:text-amber-200'
              : 'bg-emerald-50/90 border-emerald-200 text-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-200'
          }`}
          role="alert"
        >
          {toast.type === 'warning' ? (
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-sm font-medium">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-200/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
