import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import AddEditSubscription from './pages/AddEditSubscription';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';

// Component to conditionally wrap Layout
const AppRoutes = () => {
  const location = useLocation();
  const noLayoutPaths = ['/', '/login', '/signup'];
  const showLayout = !noLayoutPaths.includes(location.pathname);

  return (
    <>
      {showLayout ? (
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/add" element={<AddEditSubscription />} />
            <Route path="/edit/:id" element={<AddEditSubscription />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}
    </>
  );
};

const App = () => {
  return (
    <SubscriptionProvider>
      <Router>
        <AppRoutes />
      </Router>
    </SubscriptionProvider>
  );
};

export default App;
