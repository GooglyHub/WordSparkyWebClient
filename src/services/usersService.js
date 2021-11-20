import http from './httpService';

const apiEndpoint = '/users';

const register = (userInfo) => {
    return http.post(apiEndpoint, userInfo);
};

const checkToken = (token) => {
    return http.get(apiEndpoint, { params: { token } });
};

const getNumRenames = () => {
    return http.get(apiEndpoint + '/renames');
};

const updateProfile = (userInfo) => {
    return http.put(apiEndpoint, userInfo);
};

const changePassword = (passwordInfo) => {
    return http.put(apiEndpoint + '/changePassword', passwordInfo);
};

export { register, checkToken, getNumRenames, updateProfile, changePassword };
