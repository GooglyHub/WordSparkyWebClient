import http from './httpService';

const apiEndpoint = '/users';

const register = (userInfo) => {
    return http.post(apiEndpoint, userInfo);
};

const updateProfile = (userInfo) => {
    return http.put(apiEndpoint, userInfo);
};

const changePassword = (passwordInfo) => {
    return http.put(apiEndpoint + '/changePassword', passwordInfo);
};

export { register, updateProfile, changePassword };
