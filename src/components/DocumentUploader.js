import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    CircularProgress, 
    Alert, 
    Card, 
    CardContent, 
    Chip, 
    Grid, 
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    LinearProgress,
    Fade,
    Slide,
    IconButton,
    Container
} from '@mui/material';
import { 
    ExpandMore as ExpandMoreIcon,
    CloudUpload as CloudUploadIcon,
    InsertDriveFile as FileIcon,
    Close as CloseIcon,
    CheckCircle as CheckIcon,
    Error as ErrorIcon,
    AutoAwesome as AIIcon
} from '@mui/icons-material';
import axios from 'axios';

// Add custom styles for animations
const styles = `
  @keyframes bounce {
    0%, 20%, 60%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    80% {
      transform: translateY(-5px);
    }
  }
`;

// Inject styles into the document head
if (!document.getElementById('custom-animations')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'custom-animations';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

const DocumentUploader = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
        setAnalysisResult(null);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        clearMessages();
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/')) {
                setFile(droppedFile);
                clearMessages();
            } else {
                setError('Please upload only PDF or image files (PNG, JPG, JPEG)');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        clearMessages();

        try {
            const response = await axios.post(
                'http://localhost:8000/api/news/upload-document/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setSuccess('Document processed successfully with AI analysis!');
            setAnalysisResult(response.data);
            setFile(null);
            // Reset the file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 
                               err.response?.data?.message || 
                               'Error processing document. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2
                    }}
                >
                    <AIIcon sx={{ mr: 2, fontSize: '3rem', color: '#2196F3' }} />
                    AI-Powered Document Analyzer
                </Typography>
                <Typography 
                    variant="h6" 
                    color="textSecondary" 
                    sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
                >
                    Upload your PDF or image documents and let our advanced AI extract insights, keywords, and comprehensive analysis
                </Typography>
            </Box>

            {/* Upload Section */}
            <Paper 
                elevation={3}
                sx={{ 
                    p: 4, 
                    mb: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    border: dragActive ? '2px dashed #2196F3' : '2px dashed transparent',
                    transition: 'all 0.3s ease'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CloudUploadIcon 
                        sx={{ 
                            fontSize: '4rem', 
                            color: '#2196F3', 
                            mb: 2,
                            animation: dragActive ? 'bounce 1s infinite' : 'none'
                        }} 
                    />
                    
                    <Typography variant="h6" gutterBottom>
                        Upload Your Document
                    </Typography>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Drag and drop your file here, or click to browse
                    </Typography>

                    <input
                        accept=".pdf,.png,.jpg,.jpeg"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    
                    <label htmlFor="raised-button-file">
                        <Button 
                            variant="contained" 
                            component="span" 
                            size="large"
                            startIcon={<FileIcon />}
                            sx={{ 
                                px: 4, 
                                py: 1.5,
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Select File
                        </Button>
                    </label>

                    {file && (
                        <Fade in={Boolean(file)}>
                            <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2, display: 'inline-block' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FileIcon color="primary" />
                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        {file.name}
                                    </Typography>
                                    <IconButton 
                                        size="small" 
                                        onClick={() => {
                                            setFile(null);
                                            clearMessages();
                                        }}
                                        sx={{ ml: 1 }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography variant="caption" color="textSecondary">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </Typography>
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Paper>

            {/* Upload Button */}
            {file && (
                <Slide direction="up" in={Boolean(file)} mountOnEnter unmountOnExit>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            disabled={loading}
                            size="large"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AIIcon />}
                            sx={{ 
                                px: 6, 
                                py: 1.5,
                                borderRadius: 2,
                                background: loading ? 
                                    'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)' :
                                    'linear-gradient(45deg, #4CAF50 30%, #45A049 90%)',
                                '&:hover': {
                                    background: loading ? 
                                        'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)' :
                                        'linear-gradient(45deg, #45A049 30%, #388E3C 90%)',
                                    transform: loading ? 'none' : 'translateY(-2px)',
                                    boxShadow: loading ? 'none' : '0 8px 25px rgba(76, 175, 80, 0.3)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? 'Processing with AI...' : 'Analyze with AI'}
                        </Button>
                    </Box>
                </Slide>
            )}

            {/* Loading Progress */}
            {loading && (
                <Fade in={loading}>
                    <Box sx={{ mb: 3 }}>
                        <LinearProgress 
                            sx={{ 
                                borderRadius: 1,
                                height: 8,
                                background: 'rgba(33, 150, 243, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                                }
                            }} 
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 1 }}>
                            Our AI is analyzing your document... This may take a few moments.
                        </Typography>
                    </Box>
                </Fade>
            )}

            {/* Error Message */}
            {error && (
                <Slide direction="up" in={Boolean(error)} mountOnEnter unmountOnExit>
                    <Alert 
                        severity="error" 
                        sx={{ mb: 3, borderRadius: 2 }}
                        icon={<ErrorIcon />}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setError(null)}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {error}
                        </Typography>
                    </Alert>
                </Slide>
            )}

            {/* Success Message */}
            {success && (
                <Slide direction="up" in={Boolean(success)} mountOnEnter unmountOnExit>
                    <Alert 
                        severity="success" 
                        sx={{ mb: 3, borderRadius: 2 }}
                        icon={<CheckIcon />}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setSuccess(null)}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {success}
                        </Typography>
                    </Alert>
                </Slide>
            )}

            {/* Analysis Results */}
            {analysisResult && (
                <Fade in={Boolean(analysisResult)}>
                    <Box sx={{ mt: 4 }}>
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                mb: 3,
                                color: '#2196F3'
                            }}
                        >
                            <CheckIcon sx={{ fontSize: '2rem' }} />
                            Analysis Results
                        </Typography>
                        
                        {/* News Entry Information */}
                        <Card 
                            sx={{ 
                                mb: 3, 
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                '& .MuiCardContent-root': { color: 'white' }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FileIcon />
                                    Document Summary
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {analysisResult.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                                            {analysisResult.summary}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            <strong>Source:</strong> {analysisResult.source || 'Uploaded Document'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* AI Analysis Results */}
                        {analysisResult.ai_analysis && (
                            <Card sx={{ mb: 3, borderRadius: 3 }}>
                                <Accordion defaultExpanded>
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{ 
                                            background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                                            color: 'white',
                                            '& .MuiAccordionSummary-expandIconWrapper': { color: 'white' }
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AIIcon />
                                            AI-Powered Analysis
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            {/* Keywords */}
                                            {analysisResult.ai_analysis.keywords && analysisResult.ai_analysis.keywords.length > 0 && (
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" gutterBottom sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                                                        🏷️ Keywords
                                                    </Typography>
                                                    <Box sx={{ mb: 2 }}>
                                                        {analysisResult.ai_analysis.keywords.map((keyword, index) => (
                                                            <Chip 
                                                                key={index} 
                                                                label={keyword} 
                                                                size="medium" 
                                                                sx={{ 
                                                                    mr: 1, 
                                                                    mb: 1,
                                                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                                    color: 'white',
                                                                    fontWeight: 'medium'
                                                                }} 
                                                            />
                                                        ))}
                                                    </Box>
                                                </Grid>
                                            )}

                                            {/* Metrics */}
                                            {analysisResult.ai_analysis.metrics && (
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" gutterBottom sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                                                        📊 Metrics
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        {Object.entries(analysisResult.ai_analysis.metrics).map(([key, value]) => (
                                                            <Grid item xs={12} sm={6} md={4} key={key}>
                                                                <Paper 
                                                                    sx={{ 
                                                                        p: 2, 
                                                                        textAlign: 'center',
                                                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                                                        borderRadius: 2
                                                                    }}
                                                                >
                                                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                                                                        {value}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {key.replace('_', ' ').toUpperCase()}
                                                                    </Typography>
                                                                </Paper>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Grid>
                                            )}

                                            {/* Insights */}
                                            {analysisResult.ai_analysis.insights && analysisResult.ai_analysis.insights.length > 0 && (
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" gutterBottom sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                                                        💡 AI Insights
                                                    </Typography>
                                                    <Box sx={{ mb: 2 }}>
                                                        {analysisResult.ai_analysis.insights.map((insight, index) => (
                                                            <Paper 
                                                                key={index} 
                                                                sx={{ 
                                                                    p: 2, 
                                                                    mb: 2,
                                                                    borderLeft: '4px solid #FF9800',
                                                                    background: 'rgba(255, 152, 0, 0.05)'
                                                                }}
                                                            >
                                                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                                                    {insight}
                                                                </Typography>
                                                            </Paper>
                                                        ))}
                                                    </Box>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Card>
                        )}

                        {/* OCR Text Preview */}
                        {analysisResult.extracted_text && (
                            <Card sx={{ borderRadius: 3 }}>
                                <Accordion>
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{ 
                                            background: 'linear-gradient(45deg, #9C27B0 30%, #673AB7 90%)',
                                            color: 'white',
                                            '& .MuiAccordionSummary-expandIconWrapper': { color: 'white' }
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FileIcon />
                                            Extracted Text
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 3 }}>
                                        <Paper 
                                            sx={{ 
                                                p: 3, 
                                                maxHeight: 400, 
                                                overflow: 'auto',
                                                background: '#f8f9fa',
                                                borderRadius: 2
                                            }}
                                        >
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    whiteSpace: 'pre-wrap', 
                                                    fontFamily: 'monospace',
                                                    lineHeight: 1.5
                                                }}
                                            >
                                                {analysisResult.extracted_text.substring(0, 2000)}
                                                {analysisResult.extracted_text.length > 2000 && (
                                                    <Typography component="span" color="textSecondary">
                                                        ... (showing first 2000 characters)
                                                    </Typography>
                                                )}
                                            </Typography>
                                        </Paper>
                                    </AccordionDetails>
                                </Accordion>
                            </Card>
                        )}
                    </Box>
                </Fade>
            )}
        </Container>
    );
};

export default DocumentUploader;
