import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  FileCheck2, 
  FileSignature, 
  Layers, 
  ReceiptJapaneseYen, 
  ReceiptText,
  Clock,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export default function StatsGrid() {
  const { stats } = useDashboard();

  const cards = [
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-50/80 border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-800/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      tagColor: 'bg-amber-100 text-amber-800',
      description: 'Needs urgent supervisor review'
    },
    {
      title: 'Active RFQs & Bids',
      value: stats.activeRfqs,
      icon: FileSignature,
      color: 'indigo',
      bgColor: 'bg-indigo-50/80 border-indigo-200/60 dark:bg-indigo-950/20 dark:border-indigo-800/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      tagColor: 'bg-indigo-100 text-indigo-800',
      description: 'Bids closing this week'
    },
    {
      title: 'Recent Purchase Orders',
      value: stats.recentPOs,
      icon: Layers,
      color: 'emerald',
      bgColor: 'bg-emerald-50/80 border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-800/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      tagColor: 'bg-emerald-100 text-emerald-800',
      description: 'Routed, pending, and approved POs'
    },
    {
      title: 'Recent Invoices',
      value: stats.recentInvoices,
      icon: ReceiptText,
      color: 'sky',
      bgColor: 'bg-sky-50/80 border-sky-200/60 dark:bg-sky-950/20 dark:border-sky-800/30',
      iconColor: 'text-sky-600 dark:text-sky-400',
      tagColor: 'bg-sky-100 text-sky-800',
      description: 'Audited, queued and paid ledger'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`p-5 rounded-2xl border bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-3xl font-heading font-extrabold text-slate-800 mt-1.5 leading-none">
                  {card.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor} ${card.iconColor} transition-colors group-hover:scale-105 duration-300`}>
                <Icon className="h-5 w-5 shrink-0" />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 truncate mr-2">
                {card.description}
              </span>
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                card.color === 'amber' ? 'bg-amber-50 text-amber-700' :
                card.color === 'indigo' ? 'bg-indigo-50 text-indigo-700' :
                card.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                'bg-sky-50 text-sky-700'
              }`}>
                <TrendingUp className="h-2.5 w-2.5" />
                +12%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
