import http from './httpService';

const apiEndpoint = '/coins';

const getCoins = () => {
    return http.get(apiEndpoint);
};

const collectCoins = () => {
    return http.post(apiEndpoint);
};

export { getCoins, collectCoins };
