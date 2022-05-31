import http from './httpService';

const apiEndpoint = '/info/friends';

const getFriends = () => {
    return http.get(apiEndpoint);
};

export { getFriends };
