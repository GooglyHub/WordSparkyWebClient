import http from './httpService';

const apiEndpoint = '/info/reveals';

const getReveals = () => {
    return http.get(apiEndpoint);
};

export { getReveals };
