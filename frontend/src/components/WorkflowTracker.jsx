import React from 'react';
import { 
  FileText, 
  ClipboardCheck, 
  ArrowLeftRight, 
  ShieldCheck, 
  FileSpreadsheet, 
  CheckCircle2 
} from 'lucide-react';

export default function WorkflowTracker({ currentStep = 1 }) {
  const steps = [
    { name: 'RFQ Created', icon: FileText },
    { name: 'Quotations Submitted', icon: ClipboardCheck },
    { name: 'Quotation Comparison', icon: ArrowLeftRight },
    { name: 'Manager Approval', icon: ShieldCheck },
    { name: 'PO Generated', icon: FileSpreadsheet },
    { name: 'Fulfillment & Invoice', icon: CheckCircle2 }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm w-full overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-between min-w-[750px] px-2">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const isPending = stepNum > currentStep;
          
          const Icon = step.icon;

          return (
            <React.Fragment key={idx}>
              {/* Connector line between steps */}
              {idx > 0 && (
                <div 
                  className={`flex-1 h-0.5 mx-4 transition-all duration-500
                    ${isCompleted ? 'bg-emerald-500 dark:bg-emerald-600' : ''}
                    ${isActive ? 'bg-indigo-300 dark:bg-indigo-900/60' : ''}
                    ${isPending ? 'bg-slate-200 dark:bg-slate-800' : ''}
                  `}
                />
              )}

              {/* Step indicator node */}
              <div className="flex flex-col items-center space-y-2 shrink-0">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                    ${isCompleted 
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500 text-emerald-500' 
                      : ''
                    }
                    ${isActive 
                      ? 'bg-indigo-600/10 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold scale-110 shadow-indigo-600/10' 
                      : ''
                    }
                    ${isPending 
                      ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-400' 
                      : ''
                    }
                  `}
                >
                  {isCompleted ? (
                    <span className="font-bold text-xs">✓</span>
                  ) : (
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                  )}
                </div>
                <div className="text-center">
                  <p 
                    className={`text-[10px] uppercase tracking-wider font-extrabold whitespace-nowrap
                      ${isCompleted ? 'text-emerald-550 dark:text-emerald-550 font-bold' : ''}
                      ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : ''}
                      ${isPending ? 'text-slate-400 dark:text-slate-650' : ''}
                    `}
                  >
                    {step.name}
                  </p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                    {isCompleted && 'Completed'}
                    {isActive && 'In Progress'}
                    {isPending && 'Pending'}
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
