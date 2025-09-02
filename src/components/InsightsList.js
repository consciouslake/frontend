import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Container,
    CardActionArea,
    CircularProgress,
    Alert,
    LinearProgress,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { fetchIndustryInsights } from '../api';
import SearchBar from './SearchBar';
import DetailDialog from './DetailDialog';

const InsightsList = () => {
    const [insights, setInsights] = useState([]);
    const [filteredInsights, setFilteredInsights] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedInsight, setSelectedInsight] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const loadInsights = async () => {
            try {
                const data = await fetchIndustryInsights();
                setInsights(data);
                setFilteredInsights(data);
            } catch (err) {
                setError('Failed to load industry insights');
                console.error('Error loading insights:', err);
            } finally {
                setLoading(false);
            }
        };

        loadInsights();
    }, []);

    const handleSearch = (searchTerm) => {
        const filtered = insights.filter((item) =>
            Object.values(item)
                .join(' ')
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        setFilteredInsights(filtered);
    };

    const handleCardClick = (item) => {
        setSelectedInsight(item);
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
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <TrendingUpIcon fontSize="large" />
                    Industry Insights
                </Typography>
                <SearchBar onSearch={handleSearch} />
                <Grid container spacing={3}>
                    {filteredInsights.map((insight) => (
                        <Grid item xs={12} md={6} key={insight.id}>
                            <Card 
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardActionArea onClick={() => handleCardClick(insight)}>
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
                                            {insight.industry_name}
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    Market Size
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                    ${insight.market_size.toLocaleString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    Industry Size
                                                </Typography>
                                                <Typography variant="h6" color="primary">
                                                    ${insight.industry_size.toLocaleString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    Growth Rate
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="h6" color={insight.growth_rate > 0 ? 'success.main' : 'error.main'}>
                                                        {insight.growth_rate}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={Math.min(Math.max(insight.growth_rate, 0), 100)}
                                                    color={insight.growth_rate > 0 ? 'success' : 'error'}
                                                    sx={{ mt: 1 }}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            sx={{
                                                display: '-webkit-box',
                                                overflow: 'hidden',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 3,
                                            }}
                                        >
                                            {insight.key_drivers}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ mt: 2, display: 'block' }}
                                        >
                                            Last Updated: {new Date(insight.last_updated).toLocaleDateString()}
                                        </Typography>
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
                item={selectedInsight}
                type="insight"
            />
        </Container>
    );
};

export default InsightsList;
