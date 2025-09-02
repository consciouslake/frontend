# Videos Folder

Place your video files (.mp4, .webm, etc.) in this folder to use them on the home page.

## How to use videos in the home page

1. Place your video files in this folder
2. Update the HomePage.js component to reference these videos

Example usage in HomePage.js:

```jsx
const localVideos = [
  {
    title: 'Agriculture Overview',
    url: '/videos/agriculture-overview.mp4', 
    description: 'Overview of Indian agriculture sector'
  },
  {
    title: 'Food Processing Insights',
    url: '/videos/food-processing.mp4',
    description: 'Latest trends in food processing'
  }
];
```

Then update the video component to use local files instead of YouTube embeds:

```jsx
<CardMedia
  component="video"
  src={video.url}
  title={video.title}
  controls
  sx={{ borderRadius: 4, height: 260 }}
/>
```
