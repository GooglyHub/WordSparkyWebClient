import http from './httpService';
import axios from 'axios';

const apiEndpoint = '/bots';

const getAllBots = () => {
    return http.get(apiEndpoint + '/all');
};

const updateBotPuzzle = (data) => {
    return http.post(apiEndpoint, data);
};

const getHeadlines = async (categories) => {
    const headlines = [];
    for (let i = 0; i < categories.length; i++) {
        headlines.push([]);
        const cfg = {
            params: {
                apiKey: process.env.REACT_APP_NEWS_KEY,
                country: 'us',
                category: categories[i],
                pageSize: 100,
                page: 1,
            },
        };
        const oldHeader = http.unsetAuthHeader();
        const response = await axios.get(
            'https://newsapi.org/v2/top-headlines',
            cfg
        );
        http.setAuthHeader(oldHeader);
        if (response.status === 200) {
            if (response.data.status === 'ok') {
                for (const headline of response.data.articles) {
                    headlines[i].push(headline.title);
                }
            } else {
                console.log(
                    'Eror getting headlines',
                    response.data.code,
                    response.data.message
                );
            }
        }
    }
    return headlines;
};

export { getAllBots, updateBotPuzzle, getHeadlines };
