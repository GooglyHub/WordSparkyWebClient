import http from './httpService';

const apiEndpoint = '/friends';

const getFriends = () => {
    return http.get(apiEndpoint);
};

const removeFriend = (friend) => {
    return http.delete(apiEndpoint, { data: friend });
};

const addFriend = (friend) => {
    return http.put(apiEndpoint, friend);
};

const getFriendRequests = () => {
    return http.get(apiEndpoint + '/requests');
};

export { getFriends, removeFriend, addFriend, getFriendRequests };
