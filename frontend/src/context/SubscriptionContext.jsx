import React, { createContext, useContext, useState, useEffect } from 'react';
import mockSubscriptions from '../data/mockSubscriptions.json';

const SubscriptionContext = createContext();

export const useSubscriptions = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions');
    return saved ? JSON.parse(saved) : mockSubscriptions;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const addSubscription = (subscription) => {
    setSubscriptions([...subscriptions, { ...subscription, id: Date.now() }]);
  };

  const updateSubscription = (id, updatedData) => {
    setSubscriptions(
      subscriptions.map((sub) => (sub.id === parseInt(id) ? { ...sub, ...updatedData } : sub))
    );
  };

  const deleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== parseInt(id)));
  };

  const getAnalytics = () => {
    const totalMonthlySpend = subscriptions.reduce((acc, sub) => {
      if (sub.billingCycle === 'Monthly') return acc + sub.cost;
      if (sub.billingCycle === 'Yearly') return acc + sub.cost / 12;
      return acc;
    }, 0);

    const categorySpend = subscriptions.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + sub.cost;
      return acc;
    }, {});

    return {
      totalMonthlySpend: Math.round(totalMonthlySpend),
      categorySpend,
      activeSubs: subscriptions.length
    };
  };

  const getAlerts = () => {
    const today = new Date();
    return subscriptions
      .map(sub => {
        const renewalDate = new Date(sub.renewalDate);
        const diffTime = renewalDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { ...sub, type: 'expired', daysLeft: diffDays };
        if (diffDays <= 3) return { ...sub, type: 'urgent', daysLeft: diffDays };
        if (diffDays <= 7) return { ...sub, type: 'warning', daysLeft: diffDays };
        return null;
      })
      .filter(Boolean);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        getAnalytics,
        getAlerts,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
