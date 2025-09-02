import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { createNews } from '../api';

const NewsForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        source: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createNews(formData);
            setFormData({ title: '', content: '', source: '' });
            alert('News added successfully!');
        } catch (error) {
            alert('Error adding news: ' + error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Add News
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default NewsForm;
