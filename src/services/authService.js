import http from './httpService';
import jwtDecode from 'jwt-decode';

const apiEndpoint = '/auth';
const tokenKey = 'token';

const login = async (username, password) => {
    const response = await http.post(apiEndpoint + '/login', {
        username,
        password,
    });
    if (response?.data?.user?.isPremium !== true) {
        return 'Only premium users can use website';
    }
    const authToken = response.data.user.token;
    // todo: also extract the user and friends here
    // response.data.user
    // response.data.friends
    localStorage.setItem(tokenKey, authToken);
    return '';
};

const loginWithToken = (authToken) => {
    localStorage.setItem(tokenKey, authToken);
};

const logout = () => {
    localStorage.removeItem(tokenKey);
};

const getJwt = () => {
    return localStorage.getItem(tokenKey);
};

const getCurrentUser = () => {
    try {
        return jwtDecode(getJwt());
    } catch (ex) {
        return null;
    }
};

http.setJwt(getJwt());

export { login, loginWithToken, logout, getJwt, getCurrentUser };
