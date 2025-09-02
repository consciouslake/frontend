import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchNews = async () => {
    const response = await axios.get(`${API_URL}/news/`);
    return response.data;
};

export const createNews = async (newsData) => {
    const response = await axios.post(`${API_URL}/news/`, newsData);
    return response.data;
};

export const fetchIndustryInsights = async () => {
    const response = await axios.get(`${API_URL}/industry-insights/`);
    return response.data;
};

export const createIndustryInsight = async (insightData) => {
    const response = await axios.post(`${API_URL}/industry-insights/`, insightData);
    return response.data;
};
