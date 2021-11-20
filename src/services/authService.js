import http from './httpService';
import jwtDecode from 'jwt-decode';

const apiEndpoint = '/auth';
const tokenKey = 'token';

const login = async (id, verCode) => {
    const response = await http.post(apiEndpoint, { id, verCode });
    const authToken = response.data;
    localStorage.setItem(tokenKey, authToken);
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
