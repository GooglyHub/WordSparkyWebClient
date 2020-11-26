import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000/api';
//'https://rocky-gorge-77017.herokuapp.com/api';
//process.env.REACT_APP_API_URL;

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
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt;
}

const apis = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt,
};

export default apis;
