import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, ThemeProvider, CssBaseline } from '@mui/material';
import NewsForm from './components/NewsForm';
import IndustryInsightForm from './components/IndustryInsightForm';
import NewsList from './components/NewsList';
import InsightsList from './components/InsightsList';
import theme from './theme';
import DocumentUploader from './components/DocumentUploader';
import IndustriesPage from './components/IndustriesPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar 
            position="fixed" 
            elevation={0}
            sx={{
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Toolbar>
              <Typography 
                variant="h6" 
                component={Link} 
                to="/" 
                sx={{ 
                  flexGrow: 1, 
                  textDecoration: 'none', 
                  color: 'primary.main',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                }}
              >
                Insights Platform
              </Typography>
              <Button 
                component={Link} 
                to="/news"
                sx={{ 
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  }
                }}
              >
                View News
              </Button>
              <Button 
                component={Link} 
                to="/insights"
                sx={{ 
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  }
                }}
              >
                View Insights
              </Button>
              <Button 
                component={Link} 
                to="/upload-document"
                sx={{ 
                  mx: 1,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  }
                }}
              >
                Upload Document
              </Button>
              <Button 
                variant="outlined"
                component={Link} 
                to="/add-news"
                sx={{ 
                  mx: 1,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  }
                }}
              >
                Add News
              </Button>
              <Button 
                variant="contained"
                component={Link} 
                to="/add-insight"
                sx={{ 
                  ml: 1,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                Add Industry Insight
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/industries"
                sx={{
                  ml: 1,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'primary.light',
                    color: 'white',
                  }
                }}
              >
                Industry Data
              </Button>
            </Toolbar>
          </AppBar>
          <Toolbar /> {/* Add spacing below fixed AppBar */}
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsList />} />
              <Route path="/insights" element={<InsightsList />} />
              <Route path="/add-news" element={<NewsForm />} />
              <Route path="/upload-document" element={<DocumentUploader />} />
              <Route path="/add-insight" element={<IndustryInsightForm />} />
              <Route path="/industries" element={<IndustriesPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;