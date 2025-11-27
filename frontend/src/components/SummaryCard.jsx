import React from 'react';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';

const SummaryCard = ({ title, value, subtitle, icon: Icon, trend, color = 'primary' }) => {
    return (
        <div className="card relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl bg-${color}-gradient text-white shadow-lg`}>
                    {Icon && <Icon size={24} />}
                </div>
                <button className="text-muted hover:text-main transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-extrabold mb-1 tracking-tight">{value}</h3>
                <p className="text-sm text-muted font-medium mb-4">{title}</p>

                {trend && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className={`flex items-center gap-1 font-bold ${trend > 0 ? 'text-secondary' : 'text-accent'}`}>
                            <ArrowUpRight size={16} />
                            {Math.abs(trend)}%
                        </span>
                        <span className="text-muted">vs last month</span>
                    </div>
                )}
            </div>

            {/* Decorative Glow */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${color} opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-opacity duration-500`}></div>
        </div>
    );
};

export default SummaryCard;
