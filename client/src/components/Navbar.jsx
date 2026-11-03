import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Chip,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

const navItems = [
  { label: 'Dietitians', path: '/dieticians', icon: <PersonOutlineIcon fontSize="small" /> },
  { label: 'Allergy Shield', path: '/allergy-shield', icon: <ShieldOutlinedIcon fontSize="small" /> },
  { label: 'Smart Substitution', path: '/substitutions', icon: <SwapHorizIcon fontSize="small" /> },
  { label: 'Patient Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 70 }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'primary.main',
              gap: 1.2
            }}
          >
            <HealthAndSafetyIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1, color: 'text.primary' }}>
                Balanced<span style={{ color: theme.palette.primary.main }}>Bowl</span>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>
                CLINICAL MERN PLATFORM
              </Typography>
            </Box>
          </Box>

          {/* Desktop Nav Items */}
          {!isMobile ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      fontWeight: isActive ? 700 : 500,
                      bgcolor: isActive ? 'rgba(5, 150, 105, 0.08)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(5, 150, 105, 0.12)',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Chip
                label="Citi MERN Stack"
                color="primary"
                size="small"
                variant="outlined"
                sx={{ ml: 1, fontWeight: 700 }}
              />
            </Stack>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, p: 2 },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'left', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, pl: 2 }}>
            <HealthAndSafetyIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Balanced<span style={{ color: theme.palette.primary.main }}>Bowl</span>
            </Typography>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <Box sx={{ mr: 1.5, display: 'flex', color: 'primary.main' }}>{item.icon}</Box>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
