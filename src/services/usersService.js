import http from './httpService';

const apiEndpoint = '/users';

const register = (userInfo) => {
    return http.post(apiEndpoint, userInfo);
};

export { register };
