import http from './httpService';

const apiEndpoint = '/coins';

const getCoins = () => {
    return http.get(apiEndpoint);
};

export { getCoins };
