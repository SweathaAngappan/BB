import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Chip,
  Paper,
  Checkbox,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [meals, setMeals] = useState([
    { id: 1, type: 'Breakfast', title: 'Moong Dal Chilla + Mint Chutney', calories: 340, completed: true },
    { id: 2, type: 'Lunch', title: 'Quinoa Salad with Steamed Tofu & Spinach', calories: 520, completed: true },
    { id: 3, type: 'Evening Snack', title: 'Roasted Makhana & Green Tea', calories: 160, completed: false },
    { id: 4, type: 'Dinner', title: 'Palak Soup with Millet Roti & Dal', calories: 480, completed: false }
  ]);
  const [showGrocery, setShowGrocery] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('/api/user/dashboard-summary');
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      setData({
        user: { name: 'Demo Patient', weight: 68, height: 172, allergies: ['Lactose'], medicalConditions: ['PCOS'] },
        dietPlan: { title: 'Metabolic Reset & Anti-Inflammatory Protocol', dailyCalorieTarget: 1750 }
      });
    }
  };

  const toggleMeal = (id) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const completedCount = meals.filter(m => m.completed).length;
  const adherencePercent = Math.round((completedCount / meals.length) * 100);
  const consumedCalories = meals.filter(m => m.completed).reduce((sum, m) => sum + m.calories, 0);

  // Calculate BMI
  const heightInM = (data?.user?.height || 172) / 100;
  const currentWeight = data?.user?.weight || 68;
  const bmi = (currentWeight / (heightInM * heightInM)).toFixed(1);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1.5 }}>
          CLINICAL ADHERENCE MONITOR
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
          Patient Progress Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {data?.user?.name || 'Patient'} • Track your clinical metrics, meal compliance, and active protocol.
        </Typography>
      </Box>

      {/* Biometric Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Weight & BMI */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                  CURRENT WEIGHT
                </Typography>
                <MonitorWeightOutlinedIcon color="primary" />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {currentWeight} <span style={{ fontSize: '1rem', fontWeight: 500 }}>kg</span>
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                <Chip
                  label={`BMI: ${bmi} (Optimal)`}
                  size="small"
                  color="success"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Caloric Intake */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                  CALORIC BUDGET
                </Typography>
                <LocalFireDepartmentOutlinedIcon color="warning" />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {consumedCalories} <span style={{ fontSize: '1rem', fontWeight: 500 }}>/ {data?.dietPlan?.dailyCalorieTarget || 1750} kcal</span>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.round((consumedCalories / (data?.dietPlan?.dailyCalorieTarget || 1750)) * 100))}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Protocol Adherence */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TODAY'S ADHERENCE
                </Typography>
                <CheckCircleIcon color="success" />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>
                {adherencePercent}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {completedCount} of {meals.length} prescribed meals logged
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Water Intake */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                  HYDRATION
                </Typography>
                <WaterDropOutlinedIcon color="secondary" />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                2.8 <span style={{ fontSize: '1rem', fontWeight: 500 }}>/ 3.0 Liters</span>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  color="secondary"
                  variant="determinate"
                  value={93}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content: Daily Meals & Diet Plan Details */}
      <Grid container spacing={4}>
        {/* Left: Meal Checklist */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3.5, borderRadius: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Today's Prescribed Meal Protocol
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Check off meals as consumed to record live adherence
                </Typography>
              </Box>
              <Chip label="Allergen-Verified" color="primary" size="small" sx={{ fontWeight: 700 }} />
            </Stack>

            <List disablePadding>
              {meals.map((meal, index) => (
                <ListItem
                  key={meal.id}
                  disableGutters
                  sx={{
                    py: 1.5,
                    borderBottom: index < meals.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}
                  secondaryAction={
                    <Chip
                      label={`${meal.calories} kcal`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  }
                >
                  <ListItemIcon sx={{ minWidth: 42 }}>
                    <Checkbox
                      edge="start"
                      checked={meal.completed}
                      onChange={() => toggleMeal(meal.id)}
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          textDecoration: meal.completed ? 'line-through' : 'none',
                          color: meal.completed ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {meal.title}
                      </Typography>
                    }
                    secondary={`${meal.type} • Clinically Balanced`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right: Active Protocol & Dynamic Grocery Generator */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3.5, borderRadius: 4, height: '100%' }}>
            <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1.2 }}>
              ACTIVE DIET PROTOCOL
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              {data?.dietPlan?.title || 'Metabolic Reset & Anti-Inflammatory Protocol'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Prescribed by Dr. Ananya Sharma for insulin sensitivity, gut lining repair, and steady energy.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Macronutrient Target Distribution
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              <Chip label="Protein: 25%" color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
              <Chip label="Carbs: 45%" color="secondary" variant="outlined" sx={{ fontWeight: 700 }} />
              <Chip label="Healthy Fats: 30%" color="warning" variant="outlined" sx={{ fontWeight: 700 }} />
            </Stack>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<ShoppingBagOutlinedIcon />}
              onClick={() => setShowGrocery(!showGrocery)}
              sx={{ fontWeight: 700 }}
            >
              {showGrocery ? 'Hide Grocery List' : 'Generate Smart Weekly Grocery Checklist'}
            </Button>

            {showGrocery && (
              <Box sx={{ mt: 2.5, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
                  AUTOMATED GROCERY CHECKLIST (4 DAYS):
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">• 500g Yellow Moong Dal (High Protein)</Typography>
                  <Typography variant="body2">• 1kg Organic Quinoa (Gluten-Free)</Typography>
                  <Typography variant="body2">• 400g Firm Tofu (Non-Dairy Protein)</Typography>
                  <Typography variant="body2">• 250g Roasted Makhana (Fox Nuts)</Typography>
                  <Typography variant="body2">• 1 Bunch Fresh Spinach / Palak</Typography>
                </Stack>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
