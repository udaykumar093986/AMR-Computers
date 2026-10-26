import React from 'react';
import { useCart } from '../context/useCart';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastNotification = () => {
  const { notification } = useCart();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-200',
    error: 'border-rose-500/40 bg-rose-950/90 text-rose-200',
    info: 'border-cyan-500/40 bg-slate-900/95 text-slate-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in shadow-2xl">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-cyan-500/10 ${
          borderColors[notification.type] || borderColors.info
        }`}
      >
        {icons[notification.type] || icons.info}
        <span className="text-sm font-medium pr-2">{notification.message}</span>
      </div>
    </div>
  );
};
