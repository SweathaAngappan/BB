import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dieticians from './pages/Dieticians';
import ClinicalShield from './pages/ClinicalShield';
import FoodSubstitution from './pages/FoodSubstitution';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dieticians" element={<Dieticians />} />
              <Route path="/allergy-shield" element={<ClinicalShield />} />
              <Route path="/substitutions" element={<FoodSubstitution />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
