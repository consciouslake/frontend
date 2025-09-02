import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';

const FoodProcessingIndustry = () => {
  const [metrics, setMetrics] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching food processing data...');
        const response = await fetch('http://localhost:8000/api/industries/food-processing/');
        const data = await response.json();
        console.log('Food Processing API Response:', data);
        console.log('Food Processing Metrics:', data.metrics);
        console.log('Food Processing Trends:', data.trends);
        
        // Always set the data regardless of status
        setMetrics(data.metrics || []);
        setTrends(data.trends || []);
        console.log('State after setting:', { metrics, trends });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food processing data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Group metrics by type
  const groupedMetrics = metrics.reduce((acc, metric) => {
    const type = metric.metric_type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(metric);
    return acc;
  }, {});

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Food Processing Industry</Typography>
      
      {Object.entries(groupedMetrics).map(([type, typeMetrics]) => (
        <Box key={type} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
          </Typography>
          <Grid container spacing={3}>
            {typeMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={4} key={metric.id || index}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  },
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'primary.main',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          fontSize: '0.75rem',
                          mb: 1
                        }}
                      >
                        {metric.metric_name}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #1e88e5 30%, #00acc1 90%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        {metric.value} {metric.currency}
                      </Typography>
                      {metric.unit !== 'SHARE' && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {metric.unit}
                        </Typography>
                      )}
                    </Box>
                    {metric.notes && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          lineHeight: 1.6 
                        }}
                      >
                        {metric.notes}
                      </Typography>
                    )}
                    {metric.year && (
                      <Box sx={{ 
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            bgcolor: metric.is_projected ? 'warning.light' : 'success.light',
                            color: metric.is_projected ? 'warning.dark' : 'success.dark',
                            py: 0.5,
                            px: 1,
                            borderRadius: '4px',
                            fontWeight: 500
                          }}
                        >
                          {metric.year} {metric.is_projected ? '(Projected)' : '(Actual)'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <Typography variant="h5" sx={{ mb: 2 }}>Growth Trends</Typography>
      <Grid container spacing={3}>
        {trends.map((trend, index) => (
          <Grid item xs={12} sm={6} md={4} key={trend.id || index}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {trend.description || trend.trend_type}
                </Typography>
                <Typography variant="h5" component="div" sx={{ mb: 1 }}>
                  {trend.value}%
                </Typography>
                {trend.start_year && trend.end_year && (
                  <Typography variant="caption" display="block">
                    {trend.start_year} - {trend.end_year}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FoodProcessingIndustry;
