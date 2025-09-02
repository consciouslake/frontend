import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Chip,
    Grid,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DetailDialog = ({ open, onClose, item, type }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    
    if (!open) return null;

    const renderNewsContent = () => {
        if (!item) return null;
        
        return (
            <>
                <Typography variant="h5" gutterBottom>
                    {item.title}
                </Typography>
                <Typography variant="body1" paragraph>
                    {item.content}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Source: {item.source}
                    </Typography>
                    <Typography variant="caption" display="block" color="textSecondary">
                        Added: {new Date(item.date_added).toLocaleString()}
                    </Typography>
                </Box>
                {item.keywords && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Keywords:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {item.keywords.map((keyword, index) => (
                                <Chip
                                    key={index}
                                    label={keyword}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </>
        );
    };

    const renderInsightContent = () => {
        if (!item) return null;

        return (
            <>
                <Typography variant="h5" gutterBottom>
                    {item.industry_name}
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Market Size
                            </Typography>
                            <Typography variant="h6">
                                ${(item.market_size || 0).toLocaleString()}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Industry Size
                            </Typography>
                            <Typography variant="h6">
                                ${(item.industry_size || 0).toLocaleString()}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Growth Rate
                            </Typography>
                            <Typography variant="h6">
                                {item.growth_rate || 0}%
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom>
                    Key Drivers
                </Typography>
                <Typography variant="body1" paragraph>
                    {item.key_drivers || 'No key drivers provided'}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="textSecondary">
                        Last Updated: {new Date(item.last_updated).toLocaleString()}
                    </Typography>
                </Box>
            </>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    bgcolor: 'background.default',
                },
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'background.paper' }}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'text.secondary',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {type === 'news' ? renderNewsContent() : renderInsightContent()}
            </DialogContent>
        </Dialog>
    );
};

export default DetailDialog;
