import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Container,
    CardActionArea,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { fetchNews } from '../api';
import SearchBar from './SearchBar';
import DetailDialog from './DetailDialog';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await fetchNews();
                setNews(data);
                setFilteredNews(data);
            } catch (err) {
                setError('Failed to load news');
                console.error('Error loading news:', err);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, []);

    const handleSearch = (searchTerm) => {
        const filtered = news.filter((item) =>
            Object.values(item)
                .join(' ')
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        setFilteredNews(filtered);
    };

    const handleCardClick = (item) => {
        setSelectedNews(item);
        setDialogOpen(true);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 3
                    }}
                >
                    News Collection
                </Typography>
                <SearchBar onSearch={handleSearch} />
                <Grid container spacing={3}>
                    {filteredNews.map((item) => (
                        <Grid item xs={12} md={6} key={item.id}>
                            <Card 
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardActionArea onClick={() => handleCardClick(item)}>
                                    <CardContent>
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom
                                            sx={{ 
                                                fontWeight: 'bold',
                                                color: 'text.primary',
                                                mb: 2
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            color="text.secondary" 
                                            paragraph
                                            sx={{
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 3,
                                            }}
                                        >
                                            {item.content}
                                        </Typography>
                                        {item.keywords && (
                                            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {item.keywords.slice(0, 3).map((keyword, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={keyword}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                        <Box sx={{ mt: 'auto' }}>
                                            <Typography variant="subtitle2" color="primary">
                                                Source: {item.source}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Added: {new Date(item.date_added).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <DetailDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                item={selectedNews}
                type="news"
            />
        </Container>
    );
};

export default NewsList;
