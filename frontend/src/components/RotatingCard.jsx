import React from 'react';
import { ArrowRight } from 'lucide-react';

const RotatingCard = ({ subscription }) => {
    if (!subscription) return null;

    return (
        <div className="rotating-card-container" style={{ perspective: '1000px' }}>
            <div className="rotating-card" style={{
                background: `linear-gradient(135deg, ${subscription.color} 0%, ${adjustColor(subscription.color, -20)} 100%)`,
                borderRadius: '24px',
                padding: '1.5rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                transition: 'transform 0.5s ease',
                cursor: 'pointer',
                height: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                {/* Abstract Background Shapes */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-20%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(40px)'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex justify-between items-start mb-4">
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}>
                            {subscription.name.charAt(0)}
                        </div>
                        <div style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            background: 'rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(5px)',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            {subscription.category}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-1">{subscription.name}</h3>
                        <p className="text-sm opacity-90">Premium Plan</p>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }} className="flex justify-between items-end">
                    <div>
                        <p className="text-xs opacity-75 mb-1">Monthly Cost</p>
                        <p className="text-xl font-bold">₹{subscription.monthlyCost}</p>
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'white',
                        color: subscription.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper to darken color for gradient
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default RotatingCard;
