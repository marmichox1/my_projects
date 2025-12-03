import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon, colorClass = "bg-white" }) => {
  return (
    <div className={`p-6 rounded-2xl shadow-sm border border-slate-100 ${colorClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 truncate break-all">{value}</h3>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`flex items-center font-medium ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendUp ? '+' : '-'}{trend}
          </span>
          <span className="text-slate-400 ml-2">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;