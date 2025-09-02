import React from 'react';
import { Container, Box, Tab, Tabs, Typography } from '@mui/material';
import AgricultureIndustry from './AgricultureIndustry';
import FoodProcessingIndustry from './FoodProcessingIndustry';

const IndustriesPage = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
      <Box sx={{ 
        background: 'linear-gradient(145deg, #f6f8fc 0%, #ffffff 100%)',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        p: 3,
        mb: 4 
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}
        >
          Industry Insights
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mb: 4
        }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px',
                background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
              },
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                fontWeight: 500,
                mx: 2,
                transition: 'all 0.3s',
                '&:hover': {
                  color: '#1a237e',
                  transform: 'translateY(-2px)'
                }
              }
            }}
          >
            <Tab 
              label="Agriculture & Allied" 
              icon={<span role="img" aria-label="agriculture">🌾</span>}
              iconPosition="start"
            />
            <Tab 
              label="Food Processing" 
              icon={<span role="img" aria-label="food">🏭</span>}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Box>

      <Box sx={{ 
        py: 2,
        minHeight: '60vh',
        position: 'relative'
      }}>
        {selectedTab === 0 && <AgricultureIndustry />}
        {selectedTab === 1 && <FoodProcessingIndustry />}
      </Box>
    </Container>
  );
};

export default IndustriesPage;
