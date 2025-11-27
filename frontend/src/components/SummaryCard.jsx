import React from 'react';

const SummaryCard = ({ title, value, subtext, icon: Icon, color }) => {
    return (
        <div className="card">
            <h3 className="text-muted text-sm font-bold mb-2">{title}</h3>
            <div className="flex items-end gap-2 mb-1">
                <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1' }}>{value}</span>
            </div>
            {subtext && (
                <p className="text-xs" style={{ color: '#10B981', fontWeight: '500', marginTop: '0.5rem' }}>
                    {subtext}
                </p>
            )}
        </div>
    );
};

export default SummaryCard;
