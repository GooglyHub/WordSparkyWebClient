import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, (error) => {
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;
    if (expectedError) {
        console.log(error);
    }
    return Promise.reject(error);
});

function setJwt(jwt) {
    if (jwt) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt;
    }
}

function unsetAuthHeader() {
    const ret = axios.defaults.headers.common['Authorization'];
    delete axios.defaults.headers.common['Authorization'];
    return ret;
}

function setAuthHeader(header) {
    axios.defaults.headers.common['Authorization'] = header;
}

const apis = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt,
    unsetAuthHeader,
    setAuthHeader,
};

export default apis;
