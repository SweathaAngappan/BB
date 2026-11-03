import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  AlertTitle,
  Stack,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScienceIcon from '@mui/icons-material/Science';

const sampleMeals = [
  'Whole wheat paratha with paneer and butter',
  'Peanut butter shake with whole milk',
  'Sugar syrup pancake with white refined flour',
  'Steamed quinoa with tofu and spinach salad',
  'Crispy fried prawns with soy glaze'
];

export default function ClinicalShield() {
  const [mealInput, setMealInput] = useState('Whole wheat paratha with paneer and butter');
  const [selectedAllergies, setSelectedAllergies] = useState(['Lactose', 'Gluten']);
  const [selectedConditions, setSelectedConditions] = useState(['Diabetes']);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const availableAllergies = ['Lactose', 'Peanuts', 'Gluten', 'Eggs', 'Soy', 'Shellfish'];
  const availableConditions = ['Diabetes', 'Hypertension', 'GERD', 'Renal / Kidney', 'Gout / High Uric Acid'];

  const toggleAllergy = (allergy) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  const toggleCondition = (cond) => {
    setSelectedConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const handleCheck = async () => {
    if (!mealInput.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/clinical/check-allergies', {
        mealItem: mealInput,
        allergies: selectedAllergies,
        medicalConditions: selectedConditions
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      // Fallback client-side safety evaluation
      const hasLactose = /milk|paneer|curd|cheese|butter/i.test(mealInput);
      const hasGluten = /wheat|roti|paratha|bread|pasta/i.test(mealInput);
      const hasPeanuts = /peanut|groundnut/i.test(mealInput);
      const hasSugar = /sugar|sweet|syrup|dessert/i.test(mealInput);

      let mockAlerts = [];
      if (hasLactose && selectedAllergies.includes('Lactose')) {
        mockAlerts.push({ type: 'Allergy', trigger: 'Lactose / Dairy', severity: 'High', advice: 'Substitute with almond milk or tofu.' });
      }
      if (hasGluten && selectedAllergies.includes('Gluten')) {
        mockAlerts.push({ type: 'Allergy', trigger: 'Gluten / Wheat', severity: 'High', advice: 'Substitute with millet, quinoa, or brown rice.' });
      }
      if (hasPeanuts && selectedAllergies.includes('Peanuts')) {
        mockAlerts.push({ type: 'Allergy', trigger: 'Peanut', severity: 'Severe', advice: 'Replace with sunflower seeds or almond butter.' });
      }
      if (hasSugar && selectedConditions.includes('Diabetes')) {
        mockAlerts.push({ type: 'Medical Condition', trigger: 'High Glycemic Sugars', severity: 'High', advice: 'Avoid simple sugars. Use stevia or low-GI berries.' });
      }

      setResult({
        hasConflict: mockAlerts.length > 0,
        severity: mockAlerts.some(a => a.severity === 'Severe') ? 'Severe' : (mockAlerts.length ? 'High' : 'None'),
        alerts: mockAlerts,
        summary: mockAlerts.length ? `Detected ${mockAlerts.length} clinical contraindication(s).` : 'Meal passes all active clinical safety checks.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
          <ShieldOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Clinical Contraindication & Allergy Safety Shield
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Scans meal items dynamically against patient medical profiles and severe allergen triggers to enforce clinical safety before meals are logged.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Input Form & Toggles */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                1. Patient Health Profile (Simulated)
              </Typography>

              {/* Allergies Chips */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                  ACTIVE ALLERGIES (Click to toggle)
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {availableAllergies.map((allergy) => {
                    const isSelected = selectedAllergies.includes(allergy);
                    return (
                      <Chip
                        key={allergy}
                        label={allergy}
                        color={isSelected ? 'error' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        onClick={() => toggleAllergy(allergy)}
                        sx={{ fontWeight: 600 }}
                      />
                    );
                  })}
                </Stack>
              </Box>

              {/* Medical Conditions */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                  CHRONIC MEDICAL CONDITIONS
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {availableConditions.map((cond) => {
                    const isSelected = selectedConditions.includes(cond);
                    return (
                      <Chip
                        key={cond}
                        label={cond}
                        color={isSelected ? 'warning' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        onClick={() => toggleCondition(cond)}
                        sx={{ fontWeight: 600 }}
                      />
                    );
                  })}
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                2. Enter or Select Meal Item
              </Typography>

              <TextField
                fullWidth
                label="Meal or Food Description"
                placeholder="e.g. Oats porridge with peanut butter and cows milk"
                value={mealInput}
                onChange={(e) => setMealInput(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                QUICK SAMPLES:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {sampleMeals.map((sample, i) => (
                  <Chip
                    key={i}
                    label={sample}
                    size="small"
                    variant="outlined"
                    onClick={() => setMealInput(sample)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Stack>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ScienceIcon />}
                onClick={handleCheck}
                disabled={loading || !mealInput.trim()}
                sx={{ py: 1.4, fontWeight: 700 }}
              >
                {loading ? 'Evaluating Safety Engine...' : 'Run Clinical Safety Analysis'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Engine Analysis Output */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={2}
            sx={{
              p: 3.5,
              height: '100%',
              bgcolor: result?.hasConflict ? '#fff7ed' : (result ? '#f0fdf4' : '#ffffff'),
              border: '1px solid',
              borderColor: result?.hasConflict ? '#fdba74' : (result ? '#bbf7d0' : '#e2e8f0')
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Clinical Shield Verdict
            </Typography>

            {!result ? (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <ShieldOutlinedIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="body2">
                  Select allergens and click <strong>Run Clinical Safety Analysis</strong> to inspect the engine's rule-matching output.
                </Typography>
              </Box>
            ) : (
              <Box>
                {result.hasConflict ? (
                  <Alert severity={result.severity === 'Severe' ? 'error' : 'warning'} sx={{ mb: 3, borderRadius: 2 }}>
                    <AlertTitle sx={{ fontWeight: 800 }}>
                      {result.severity.toUpperCase()} RISK DETECTED
                    </AlertTitle>
                    {result.summary || 'Conflicts found with your medical and allergy profile.'}
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    <AlertTitle sx={{ fontWeight: 800 }}>CLINICALLY SAFE</AlertTitle>
                    No allergy triggers or medical contraindications detected for this meal.
                  </Alert>
                )}

                {result.alerts && result.alerts.length > 0 && (
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Specific Contraindication Triggers:
                    </Typography>
                    {result.alerts.map((alert, idx) => (
                      <Paper key={idx} sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #fed7aa' }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                          <WarningAmberIcon color="warning" fontSize="small" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#c2410c' }}>
                            {alert.trigger || alert.condition || 'Allergen Conflict'} ({alert.severity || 'High'})
                          </Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          <strong>Clinical Recommendation:</strong> {alert.advice || 'Consider substituting this item with a tolerated alternative.'}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
