import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SpeedIcon from '@mui/icons-material/Speed';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';

const features = [
  {
    icon: <ShieldOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    title: 'Clinical Allergy Shield',
    desc: 'Instant rule-based contraindication scanning that flags severe allergen triggers and medical conflicts (Diabetes, Hypertension, Lactose).'
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 36, color: 'secondary.main' }} />,
    title: 'Smart Ingredient Substitution',
    desc: 'Context-aware ingredient alternative recommendations tailored for dairy-free, low-GI, keto, or vegan dietary preferences.'
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 36, color: 'warning.main' }} />,
    title: 'Adherence & Biometrics',
    desc: 'Real-time metabolic status calculations (BMI, Mifflin-St Jeor BMR) with daily meal tracking and compliance scoring.'
  },
  {
    icon: <EventAvailableIcon sx={{ fontSize: 36, color: 'success.main' }} />,
    title: 'Tele-Consultation Booking',
    desc: 'Multi-slot consultation scheduler connecting patients with certified clinical dieticians with integrated payment workflows.'
  }
];

export default function Home() {
  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'linear-gradient(180deg, #ecfdf5 0%, #f8fafc 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Full-Stack MERN Architecture • React & Material UI"
                color="primary"
                size="medium"
                sx={{ mb: 3, fontWeight: 700 }}
              />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  mb: 2.5,
                  fontSize: { xs: '2.4rem', md: '3.2rem' }
                }}
              >
                Intelligent Clinical Nutrition & Diet Management
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, mb: 4, lineHeight: 1.6 }}>
                Bridging the gap between certified clinical dietary protocols and real-world patient adherence with live allergen detection, smart substitutions, and responsive tele-health consultations.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/allergy-shield"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ py: 1.6, px: 3.5, fontSize: '1rem' }}
                >
                  Test Allergy Shield
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/dieticians"
                  sx={{ py: 1.6, px: 3.5, fontSize: '1rem' }}
                >
                  Find Dietitians
                </Button>
              </Stack>
            </Grid>

            {/* Architecture Spotlight Card */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={3}
                sx={{
                  p: 3.5,
                  borderRadius: 4,
                  bgcolor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)'
                }}
              >
                <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1.2 }}>
                  SYSTEM ARCHITECTURE
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Citi Evaluated Tech Stack
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <CodeIcon color="primary" sx={{ mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Frontend: React 18 + Material UI (MUI)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Component-driven architecture, responsive theme breakpoints, custom hooks, client-side route transitions.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <StorageIcon color="secondary" sx={{ mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Database: MongoDB (Mongoose)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Flexible document schemas for health records, nested meal items, clinical allergy triggers, and appointments.
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Backend: Node.js & Express.js REST APIs
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Clean separation of concerns with controllers, middleware guards, and specialized clinical computation engines.
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Button
                  fullWidth
                  variant="tonal"
                  component={RouterLink}
                  to="/dashboard"
                  sx={{ bgcolor: 'rgba(5, 150, 105, 0.08)', color: 'primary.main', fontWeight: 700 }}
                >
                  View Live Patient Dashboard
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature Cards Grid */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1.5 }}>
            PLATFORM CAPABILITIES
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
            Engineered for Patient Safety & Compliance
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>{feat.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feat.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
