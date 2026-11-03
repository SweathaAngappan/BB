import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dieticians from './pages/Dieticians';
import Dashboard from './pages/Dashboard';
import DietPlan from './pages/DietPlan';
import GroceryList from './pages/GroceryList';
import Consultations from './pages/Consultations';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Sweatha',
    email: 'sweatha@balancedbowl.com',
    role: 'user'
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="container">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/dieticians" element={<Dieticians />} />
            <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/diet-plan" element={<DietPlan />} />
            <Route path="/grocery-list" element={<GroceryList />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
