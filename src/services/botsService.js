import http from './httpService';
import axios from 'axios';

const apiEndpoint = '/bots';

const getBots = () => {
    return http.get(apiEndpoint + '/all');
};

const updateBotPuzzle = (data) => {
    return http.post(apiEndpoint, data);
};

const getPastDayRange = () => {
    const now = new Date();
    const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000);
    return (
        fortyEightHoursAgo.toISOString().split('T')[0] +
        ',' +
        now.toISOString().split('T')[0]
    );
};

const getHeadlines = async (categories) => {
    const cfg = {
        params: {
            access_key: process.env.REACT_APP_NEWS_KEY,
            countries: 'us',
            categories: categories.join(','),
            sort: 'popularity',
            limit: '100',
            date: getPastDayRange(),
        },
    };
    const oldHeader = http.unsetAuthHeader();
    const response = await axios.get('http://api.mediastack.com/v1/news', cfg);
    http.setAuthHeader(oldHeader);

    const headlines = [];
    for (let i = 0; i < categories.length; i++) {
        headlines.push([]);
    }
    if (response.status === 200) {
        for (const headline of response.data.data) {
            for (let i = 0; i < categories.length; i++) {
                if (headline.category === categories[i]) {
                    headlines[i].push(headline.title);
                    break;
                }
            }
        }
    }

    // Find any categories that got left behind
    let prevCategoriesLength = 1 + categories.length;
    for (let iters = 0; iters < categories.length; iters++) {
        const lowCats = [];
        for (let i = 0; i < categories.length; i++) {
            if (headlines[i].length < 5) {
                lowCats.push(categories[i]);
            }
        }
        if (lowCats.length === 0) {
            break;
        }
        if (lowCats.length === prevCategoriesLength) {
            break;
        }
        prevCategoriesLength = lowCats.length;

        const oldHeader = http.unsetAuthHeader();
        cfg.params.categories = lowCats.join(',');
        const response = await axios.get(
            'http://api.mediastack.com/v1/news',
            cfg
        );
        http.setAuthHeader(oldHeader);

        if (response.status === 200) {
            for (const headline of response.data.data) {
                for (let i = 0; i < categories.length; i++) {
                    if (headline.category === categories[i]) {
                        headlines[i].push(headline.title);
                        break;
                    }
                }
            }
        }
    }
    return headlines;
};

export { getBots, updateBotPuzzle, getHeadlines };
