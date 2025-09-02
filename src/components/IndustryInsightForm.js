import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { createIndustryInsight } from '../api';

const IndustryInsightForm = () => {
    const [formData, setFormData] = useState({
        industry_name: '',
        market_size: '',
        industry_size: '',
        growth_rate: '',
        key_drivers: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createIndustryInsight(formData);
            setFormData({
                industry_name: '',
                market_size: '',
                industry_size: '',
                growth_rate: '',
                key_drivers: ''
            });
            alert('Industry insight added successfully!');
        } catch (error) {
            alert('Error adding industry insight: ' + error.message);
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
                    Add Industry Insight
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Industry Name"
                        name="industry_name"
                        value={formData.industry_name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Market Size"
                        name="market_size"
                        type="number"
                        value={formData.market_size}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Industry Size"
                        name="industry_size"
                        type="number"
                        value={formData.industry_size}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Growth Rate (%)"
                        name="growth_rate"
                        type="number"
                        value={formData.growth_rate}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Key Drivers"
                        name="key_drivers"
                        value={formData.key_drivers}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
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

export default IndustryInsightForm;
