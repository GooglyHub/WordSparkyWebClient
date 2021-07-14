import http from './httpService';

const apiEndpoint = '/coins';

const getCoins = () => {
    return http.get(apiEndpoint);
};

const coinEarned = () => {
    return http.post(apiEndpoint + '/earned', {});
};

export { getCoins, coinEarned };
