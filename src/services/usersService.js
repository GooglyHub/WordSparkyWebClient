import http from './httpService';

const apiEndpoint = '/users';

const register = (userInfo) => {
    return http.post(apiEndpoint, userInfo);
};

const updateProfile = (userInfo) => {
    return http.put(apiEndpoint, userInfo);
};

export { register, updateProfile };
