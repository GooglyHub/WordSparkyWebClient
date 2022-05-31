import http from './httpService';

const apiEndpoint = '/users';

const updateProfile = (userInfo) => {
    return http.put(apiEndpoint, userInfo);
};

const changePassword = (passwordInfo) => {
    return http.put(apiEndpoint + '/changePassword', passwordInfo);
};

export { updateProfile, changePassword };
