import React from 'react';
import { Box, Container, Typography, Stack, Divider, Chip } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0f172a', color: '#94a3b8', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={3}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ color: '#fff', mb: 1 }}>
              <HealthAndSafetyIcon sx={{ color: '#10b981' }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                The Balanced Bowl
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ maxWidth: 450 }}>
              Full-Stack MERN clinical nutrition platform with real-time allergen contraindication shields, smart ingredient substitutions, and tele-consultation booking.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="React 18" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#38bdf8' }} />
            <Chip label="Material UI v6" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#007FFF' }} />
            <Chip label="Node.js & Express" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#4ade80' }} />
            <Chip label="MongoDB Mongoose" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#34d399' }} />
            <Chip label="REST API" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#facc15' }} />
          </Stack>
        </Stack>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
          <Typography variant="caption">
            © 2026 The Balanced Bowl. Developed by Sweatha A M (PSG Tech MCA).
          </Typography>
          <Typography variant="caption">
            Architected for Citi India Apprenticeship Evaluation • React + MongoDB MERN Architecture
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
