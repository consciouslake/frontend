import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Paper, Divider, ToggleButtonGroup, ToggleButton, IconButton, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

// YouTube embedded videos
const youtubeVideos = [
  {
    title: 'India AgriTech Revolution',
    url: 'https://www.youtube.com/embed/1O4kLzFh8pY',
    description: 'How technology is transforming Indian agriculture.',
    type: 'youtube'
  },
  {
    title: 'Food Processing Industry Insights',
    url: 'https://www.youtube.com/embed/2Q0QnQkQ2Jw',
    description: 'Growth and opportunities in food processing.',
    type: 'youtube'
  }
];

// Video Player Component
const VideoPlayer = ({ video, index, updatePlayState }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(video.isPlaying || false);
  const [isMuted, setIsMuted] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        video.isPlaying = false;
        if (updatePlayState) updatePlayState(video.id, false);
      } else {
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              // Update the videos array to reflect this video is playing
              video.isPlaying = true;
              if (updatePlayState) updatePlayState(video.id, true);
            })
            .catch(error => {
              console.error("Error playing video:", error);
              // Handle autoplay being blocked
              setIsPlaying(false);
              video.isPlaying = false;
              if (updatePlayState) updatePlayState(video.id, false);
            });
        }
      }
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullScreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handleThumbnailError = () => {
    setImageError(true);
  };

  const handleVideoLoaded = () => {
    // Video has loaded successfully
    console.log(`Video loaded: ${video.title}`);
  };

  const handleVideoError = () => {
    console.error(`Error loading video: ${video.url}`);
  };

  // Handle video events
  // Handle video events - keep memoized callback dependencies
  const memoizedHandleVideoError = React.useCallback(handleVideoError, [video.url]);
  const memoizedHandleVideoLoaded = React.useCallback(handleVideoLoaded, [video.title]);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnd = () => setIsPlaying(false);

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnd);
      videoElement.addEventListener('loadeddata', memoizedHandleVideoLoaded);
      videoElement.addEventListener('error', memoizedHandleVideoError);

      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnd);
        videoElement.removeEventListener('loadeddata', memoizedHandleVideoLoaded);
        videoElement.removeEventListener('error', memoizedHandleVideoError);
      };
    }
  }, [memoizedHandleVideoError, memoizedHandleVideoLoaded]);

  return (
    <Box sx={{ position: 'relative', height: 260 }}>
      <CardMedia
        component="video"
        src={video.url}
        ref={videoRef}
        title={video.title}
        poster={imageError ? video.fallbackThumbnail : video.thumbnail}
        height="260"
        muted={isMuted}
        preload="metadata"
        onError={handleThumbnailError}
        sx={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'cover',
          borderRadius: '16px 16px 0 0',
          '&:focus': {
            outline: 'none'
          }
        }}
      />
      <Box 
        className="video-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
          borderRadius: '16px 16px 0 0',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            opacity: 1
          }
        }}
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <IconButton 
            aria-label="play/pause"
            onClick={handlePlayPause}
            sx={{
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.8)'
              },
              p: 1.5
            }}
          >
            {isPlaying ? <PauseIcon sx={{ fontSize: 40 }} /> : <PlayArrowIcon sx={{ fontSize: 40 }} />}
          </IconButton>
        </Box>
        
        <Box sx={{ 
          position: 'absolute', 
          bottom: 8, 
          right: 8, 
          display: 'flex',
          gap: 1
        }}>
          <Tooltip title={isMuted ? "Unmute" : "Mute"}>
            <IconButton 
              size="small" 
              onClick={handleMuteToggle}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Fullscreen">
            <IconButton 
              size="small" 
              onClick={handleFullScreen}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute',
            bottom: 8,
            left: 8,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}
        >
          Local Video
        </Typography>
      </Box>
    </Box>
  );
};

// Local videos from the /public/videos folder
const localVideos = [
  {
    title: 'Banking on a Billion: India\'s Financial Revolution',
    url: '/videos/Banking_on_a_Billion__India_s_Financial_Revolution.mp4',
    description: 'How financial inclusion is transforming India\'s economy',
    thumbnail: '/thumbnails/banking-billion.jpg', 
    fallbackThumbnail: 'https://source.unsplash.com/featured/?banking,india',
    duration: '12:45',
    type: 'local'
  },
  {
    title: 'India\'s Consumer Boom: The $615 Billion Story',
    url: '/videos/India_s_Consumer_Boom__The_$615_Billion_Story.mp4',
    description: 'Exploring the rapid growth of India\'s consumer market',
    thumbnail: '/thumbnails/consumer-boom.jpg',
    fallbackThumbnail: 'https://source.unsplash.com/featured/?retail,shopping',
    duration: '15:22',
    type: 'local'
  },
  {
    title: 'India\'s Economic Engine: Firing on All Cylinders',
    url: '/videos/India_s_Economic_Engine__Firing_on_All_Cylinders.mp4',
    description: 'Analysis of India\'s diverse economic sectors',
    thumbnail: '/thumbnails/economic-engine.jpg',
    fallbackThumbnail: 'https://source.unsplash.com/featured/?economy,growth',
    duration: '18:10',
    type: 'local'
  },
  {
    title: 'India\'s Tech Juggernaut: Road to $500 Billion',
    url: '/videos/India_s_Tech_Juggernaut__Road_to_$500_Billion.mp4',
    description: 'The remarkable growth story of India\'s tech industry',
    thumbnail: '/thumbnails/tech-juggernaut.jpg',
    fallbackThumbnail: 'https://source.unsplash.com/featured/?technology,india',
    duration: '14:35',
    type: 'local'
  },
  {
    title: 'India\'s Unstoppable Tech Engine',
    url: '/videos/India_s_Unstoppable_Tech_Engine.mp4',
    description: 'How technology is reshaping India\'s future',
    thumbnail: '/thumbnails/tech-engine.jpg',
    fallbackThumbnail: 'https://source.unsplash.com/featured/?innovation,digital',
    duration: '16:48',
    type: 'local'
  },
  {
    title: 'The Explainer: India\'s E-Commerce Gold Rush',
    url: '/videos/The_Explainer__India_s_E-Commerce_Gold_Rush.mp4',
    description: 'Understanding the explosive growth of e-commerce in India',
    thumbnail: '/thumbnails/ecommerce-rush.jpg',
    fallbackThumbnail: 'https://source.unsplash.com/featured/?ecommerce,online',
    duration: '13:27',
    type: 'local'
  }
];

// All available videos for the platform

const demoNews = [
  {
    title: 'Record Foodgrain Production in 2025',
    summary: 'India achieves record foodgrain output, boosting exports and rural income.',
    image: 'https://source.unsplash.com/featured/?agriculture,india',
    link: '#'
  },
  {
    title: 'FDI in Food Processing Hits New High',
    summary: 'Foreign direct investment in food processing sector reaches all-time high.',
    image: 'https://source.unsplash.com/featured/?food,industry',
    link: '#'
  }
];

const HomePage = () => {
  const [videoType, setVideoType] = useState('youtube');
  const [videos, setVideos] = useState(youtubeVideos);

  // Handle video type change
  const handleVideoTypeChange = (event, newType) => {
    if (newType !== null) {
      setVideoType(newType);
      
      // Reset all videos to not playing
      
      if (newType === 'youtube') {
        // Add id and isPlaying to YouTube videos
        const youtubeWithState = youtubeVideos.map((video, idx) => ({
          ...video,
          id: `youtube-${idx}`,
          isPlaying: false
        }));
        setVideos(youtubeWithState);
      } else if (newType === 'local') {
        // Add id and isPlaying to local videos
        const localWithState = localVideos.map((video, idx) => ({
          ...video,
          id: `local-${idx}`,
          isPlaying: false
        }));
        setVideos(localWithState);
      } else {
        // Combine both with id and isPlaying
        const allVideosWithState = [
          ...youtubeVideos.map((video, idx) => ({
            ...video,
            id: `youtube-${idx}`,
            isPlaying: false
          })),
          ...localVideos.map((video, idx) => ({
            ...video,
            id: `local-${idx}`,
            isPlaying: false
          }))
        ];
        setVideos(allVideosWithState);
      }
    }
  };
  
  // Update video play state
  const updatePlayingState = (videoId, isPlaying) => {
    // Update the playing state in the videos array
    setVideos(prevVideos => 
      prevVideos.map(v => ({
        ...v,
        isPlaying: v.id === videoId ? isPlaying : false
      }))
    );
  };
  
  // Set default to local videos with play tracking
  useEffect(() => {
    setVideoType('local');
    
    // Add isPlaying property to each video
    const videosWithPlayState = localVideos.map((video, idx) => ({
      ...video,
      id: `local-${idx}`,
      isPlaying: false
    }));
    
    setVideos(videosWithPlayState);
  }, []);

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
          Discover the latest trends, news, and opportunities in Indian Economy
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
          href="#videos"
        >
          Watch Industry Videos
        </Button>
      </Paper>

      {/* Videos Section */}
      <Box id="videos" sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        mb: 8,
        p: 4,
        borderRadius: 6,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.9) 100%)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%231976d2' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, gap: {xs: 2, sm: 0}, justifyContent: 'space-between', alignItems: {xs: 'flex-start', sm: 'center'}, mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(90deg, #1976d2 40%, #00bcd4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Featured Videos
          </Typography>
          <ToggleButtonGroup
            value={videoType}
            exclusive
            onChange={handleVideoTypeChange}
            aria-label="video source"
            size="small"
            sx={{ 
              bgcolor: 'white', 
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '.MuiToggleButton-root': {
                border: 'none',
                px: 3,
                py: 1,
                fontWeight: 600,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.1)'
                }
              },
              '.MuiToggleButton-root:first-of-type': {
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12
              },
              '.MuiToggleButton-root:last-of-type': {
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12
              }
            }}
          >
            <ToggleButton value="local" aria-label="local videos">
              Local Videos
            </ToggleButton>
            <ToggleButton value="youtube" aria-label="youtube videos">
              YouTube
            </ToggleButton>
            <ToggleButton value="all" aria-label="all videos">
              All Videos
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Grid container spacing={4}>
          {videos.map((video, idx) => (
            <Grid item xs={12} md={6} lg={4} key={idx} sx={{ position: 'relative' }}>
              {video.isPlaying && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    zIndex: 2,
                    bgcolor: 'error.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'white',
                      display: 'inline-block',
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.4 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  />
                  PLAYING
                </Box>
              )}
              <Card sx={{ 
                borderRadius: 4, 
                boxShadow: video.isPlaying ? '0 0 0 2px #f44336, 0 8px 20px rgba(0,0,0,0.2)' : 3, 
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: video.isPlaying ? '0 0 0 2px #f44336, 0 12px 25px rgba(0,0,0,0.25)' : '0 12px 20px rgba(0,0,0,0.1)'
                }
              }}>
                {video.type === 'youtube' ? (
                  <CardMedia
                    component="iframe"
                    src={video.url}
                    title={video.title}
                    height="260"
                    sx={{ borderRadius: '16px 16px 0 0' }}
                    allowFullScreen
                  />
                ) : (
                  <VideoPlayer 
                    video={video} 
                    index={idx} 
                    updatePlayState={updatePlayingState}
                  />
                )}
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>{video.title}</Typography>
                    <Box 
                      sx={{ 
                        bgcolor: video.type === 'youtube' ? 'error.main' : 'primary.main',
                        color: 'white', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        ml: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 60,
                        height: 24
                      }}
                    >
                      {video.type === 'youtube' ? 'YouTube' : 'Local'}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{video.description}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {video.duration ? `Duration: ${video.duration}` : ''}
                    </Typography>
                    {video.type === 'local' ? (
                      <Button 
                        size="small"
                        variant={video.isPlaying ? "contained" : "text"}
                        startIcon={video.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        sx={{ 
                          borderRadius: 2, 
                          textTransform: 'none',
                          px: 2,
                          '&:hover': {
                            bgcolor: video.isPlaying ? 'primary.dark' : 'rgba(25, 118, 210, 0.1)'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const videoElement = e.currentTarget.closest('.MuiCard-root').querySelector('video');
                          if (videoElement) {
                            if (videoElement.paused) {
                              videoElement.play();
                              // Update playing state in parent component
                              updatePlayingState(video.id, true);
                            } else {
                              videoElement.pause();
                              // Update playing state in parent component
                              updatePlayingState(video.id, false);
                            }
                          }
                        }}
                      >
                        {video.isPlaying ? 'Now Playing' : 'Play Video'}
                      </Button>
                    ) : (
                      <Button 
                        size="small" 
                        startIcon={<PlayArrowIcon />}
                        sx={{ 
                          borderRadius: 2, 
                          textTransform: 'none',
                          px: 2,
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.1)'
                          }
                        }}
                      >
                        Watch on YouTube
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ maxWidth: 900, mx: 'auto', mb: 6 }} />

      {/* Latest News Section */}
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
          Latest News
        </Typography>
        <Grid container spacing={4}>
          {demoNews.map((news, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card sx={{ display: 'flex', borderRadius: 4, boxShadow: 2, height: '100%' }}>
                <CardMedia
                  component="img"
                  image={news.image}
                  alt={news.title}
                  sx={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 3, m: 2 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{news.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{news.summary}</Typography>
                    <Button href={news.link} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                      Read More
                    </Button>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;
