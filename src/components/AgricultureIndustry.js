import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';

const AgricultureIndustry = () => {
  const [metrics, setMetrics] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching agriculture data...');
        const response = await fetch('http://localhost:8000/api/industries/agriculture/');
        const data = await response.json();
        console.log('Agriculture API Response:', data);
        console.log('Metrics:', data.metrics);
        console.log('Trends:', data.trends);
        
        // Always set the data regardless of status
        setMetrics(data.metrics || []);
        setTrends(data.trends || []);
        console.log('State after setting:', { metrics, trends });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching agriculture data:', error);
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

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 4 
      }}>
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '60px',
                height: '3px',
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                borderRadius: '3px'
              }
            }}
          >
            Key Metrics
          </Typography>
          <Grid container spacing={3}>
            {metrics.map((metric, index) => (
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

        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '60px',
                height: '3px',
                background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                borderRadius: '3px'
              }
            }}
          >
            Growth Trends
          </Typography>
          <Grid container spacing={3}>
            {trends.map((trend, index) => (
              <Grid item xs={12} sm={6} md={4} key={trend.id || index}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                  },
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="h3" 
                        component="div" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'success.main'
                        }}
                      >
                        {trend.value}%
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 500,
                          color: 'text.primary',
                          mt: 1
                        }}
                      >
                        {trend.description || trend.trend_type}
                      </Typography>
                    </Box>
                    {trend.start_year && trend.end_year && (
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 2
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            bgcolor: 'primary.light',
                            color: 'primary.dark',
                            py: 0.5,
                            px: 1,
                            borderRadius: '4px',
                            fontWeight: 500
                          }}
                        >
                          {trend.start_year} - {trend.end_year}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AgricultureIndustry;
