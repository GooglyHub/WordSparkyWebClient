import http from './httpService';

const apiEndpoint = '/friends';

const getFriends = () => {
    return http.get(apiEndpoint);
};

export { getFriends };
