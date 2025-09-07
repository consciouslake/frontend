import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Paper, 
  Chip, 
  Avatar,
  Skeleton,
  IconButton,
  Tooltip,
  Divider,
  Container
} from '@mui/material';
import axios from 'axios';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArticleIcon from '@mui/icons-material/Article';

// Demo news data - will be replaced with API data
const demoNews = [
  {
    id: 1,
    title: "India's Digital Economy Surges to $200 Billion",
    content: "India's digital economy has reached a milestone of $200 billion, driven by fintech innovations, e-commerce growth, and digital payments adoption across rural and urban areas. The growth is attributed to increased smartphone penetration, affordable data plans, and government initiatives promoting digital literacy.",
    source: "Economic Times",
    date_added: "2025-09-01T10:30:00Z",
    category: "Technology",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    trending: true
  },
  {
    id: 2,
    title: "Renewable Energy Investments Hit Record High in India",
    content: "India attracted $14.2 billion in renewable energy investments in 2024, making it the third-largest clean energy market globally with ambitious 2030 targets. Solar and wind energy projects are leading the charge in the country's transition to sustainable energy.",
    source: "Business Standard",
    date_added: "2025-08-30T15:45:00Z",
    category: "Energy",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
    trending: false
  },
  {
    id: 3,
    title: "Indian Startups Raise $8.1 Billion in Q3 2025",
    content: "The Indian startup ecosystem witnessed robust funding with $8.1 billion raised across 350+ deals, led by fintech, healthtech, and edtech sectors showing strong recovery. Late-stage funding rounds dominated the quarter with several unicorn births.",
    source: "Mint",
    date_added: "2025-08-28T09:15:00Z",
    category: "Startups",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
    trending: true
  },
  {
    id: 4,
    title: "Manufacturing PMI Reaches 18-Month High",
    content: "India's manufacturing PMI hit 57.8 in August 2025, indicating strong expansion driven by domestic demand and government's PLI schemes boosting production. The automotive and electronics sectors showed particularly strong performance.",
    source: "Reuters",
    date_added: "2025-08-25T14:20:00Z",
    category: "Manufacturing",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    trending: false
  },
  {
    id: 5,
    title: "India-UAE Trade Crosses $85 Billion Mark",
    content: "Bilateral trade between India and UAE has surpassed $85 billion, making UAE India's third-largest trading partner with significant growth in non-oil trade. The CEPA agreement has accelerated trade relations between the two nations.",
    source: "Hindu Business Line",
    date_added: "2025-08-22T11:30:00Z",
    category: "Trade",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=300&fit=crop",
    trending: false
  },
  {
    id: 6,
    title: "AI Adoption in Indian Enterprises Jumps 40%",
    content: "Enterprise AI adoption in India grew by 40% in 2025, with companies investing heavily in automation, data analytics, and machine learning solutions. Banking, healthcare, and retail sectors are leading the AI transformation.",
    source: "Economic Times",
    date_added: "2025-08-20T16:45:00Z",
    category: "Technology",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    trending: true
  }
];

// Category colors for visual appeal
const categoryColors = {
  Technology: '#2196F3',
  Energy: '#4CAF50',
  Startups: '#FF9800',
  Manufacturing: '#9C27B0',
  Trade: '#F44336',
  Finance: '#00BCD4',
  Healthcare: '#E91E63',
  Agriculture: '#8BC34A'
};

const HomePage = () => {
  const [news, setNews] = useState(demoNews);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredNews, setFeaturedNews] = useState([]);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/news/');
        if (response.data && response.data.length > 0) {
          // Transform API data to match our format
          const transformedNews = response.data.map((item, index) => ({
            id: item.id || index + 1,
            title: item.title,
            content: item.content,
            source: item.source || 'Unknown Source',
            date_added: item.date_added,
            category: 'Business', // Default category
            readTime: `${Math.ceil(item.content.length / 200)} min read`,
            image: `https://images.unsplash.com/photo-${1560472354 + index}?w=400&h=300&fit=crop`,
            trending: Math.random() > 0.7
          }));
          setNews(transformedNews);
        }
      } catch (error) {
        console.log('Using demo data as API is not available:', error.message);
        // Keep using demo data if API is not available
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Set featured news (trending articles)
  useEffect(() => {
    const featured = news.filter(item => item.trending).slice(0, 3);
    setFeaturedNews(featured);
  }, [news]);

  // Get unique categories
  const categories = ['all', ...new Set(news.map(item => item.category))];

  // Filter news by category
  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // News Card Component
  const NewsCard = ({ article, featured = false }) => (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: featured ? 6 : 4,
        boxShadow: featured ? '0 20px 40px rgba(0,0,0,0.1)' : '0 8px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative',
        background: featured ? 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' : '#ffffff',
        '&:hover': {
          transform: featured ? 'translateY(-10px)' : 'translateY(-5px)',
          boxShadow: featured ? '0 25px 50px rgba(0,0,0,0.15)' : '0 12px 25px rgba(0,0,0,0.12)',
        }
      }}
    >
      {article.trending && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 20,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
            animation: 'pulse 2s infinite'
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 14 }} />
          Trending
        </Box>
      )}
      
      <CardMedia
        component="img"
        height={featured ? 300 : 200}
        image={article.image}
        alt={article.title}
        sx={{ 
          objectFit: 'cover',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      />
      
      <CardContent sx={{ p: featured ? 3 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={article.category}
            size="small"
            sx={{
              backgroundColor: categoryColors[article.category] || '#757575',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 12 }} />
            {formatDate(article.date_added)}
          </Typography>
        </Box>
        
        <Typography 
          variant={featured ? "h5" : "h6"} 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: featured ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: '#1a1a1a'
          }}
        >
          {article.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: featured ? 4 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6
          }}
        >
          {article.content}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 12 }} />
              {article.readTime}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              {article.source}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Share">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <ShareIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bookmark">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <BookmarkBorderIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f8fc 0%, #e3f2fd 100%)',
      py: 6,
      px: 3,
      mt: -3
    }}>
      {/* Hero Section */}
      <Paper elevation={4} sx={{
        maxWidth: 1100,
        mx: 'auto',
        p: { xs: 3, md: 6 },
        mb: 6,
        borderRadius: 6,
        background: 'linear-gradient(120deg, #ffffff 60%, #e3f2fd 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Typography variant="h2" sx={{
          fontWeight: 800,
          background: 'linear-gradient(90deg, #1976d2 40%, #00bcd4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          Welcome to Insights Platform
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
          Stay updated with the latest trends, news, and opportunities in Indian Economy
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          sx={{
            background: 'linear-gradient(90deg, #1976d2 40%, #00bcd4 100%)',
            fontWeight: 700,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 3,
            boxShadow: 2
          }}
          href="#news"
        >
          Explore Latest News
        </Button>
      </Paper>

      {/* Featured News Section */}
      {featuredNews.length > 0 && (
        <Container maxWidth="xl" sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(90deg, #1976d2 40%, #00bcd4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              🔥 Trending Stories
            </Typography>
            <Typography variant="h6" color="text.secondary">
              The most important stories shaping India's economic landscape
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {featuredNews.map((article) => (
              <Grid item xs={12} md={4} key={article.id}>
                <NewsCard article={article} featured={true} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      <Divider sx={{ maxWidth: 900, mx: 'auto', mb: 6 }} />

      {/* Main News Section */}
      <Container maxWidth="xl" id="news">
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: {xs: 2, sm: 0}, justifyContent: 'space-between', alignItems: {xs: 'flex-start', sm: 'center'}, mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(90deg, #1976d2 40%, #00bcd4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <ArticleIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            Latest News & Insights
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: selectedCategory === category ? categoryColors[category] || '#1976d2' : 'transparent',
                  color: selectedCategory === category ? 'white' : categoryColors[category] || '#1976d2',
                  borderColor: categoryColors[category] || '#1976d2',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: categoryColors[category] || '#1976d2',
                    color: 'white'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ borderRadius: 4 }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {filteredNews.map((article) => (
              <Grid item xs={12} md={6} lg={4} key={article.id}>
                <NewsCard article={article} />
              </Grid>
            ))}
          </Grid>
        )}

        {filteredNews.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No articles found for this category.
            </Typography>
          </Box>
        )}
      </Container>

      {/* CSS for animations */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default HomePage;
