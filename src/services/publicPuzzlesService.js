import apis from './httpService';
import http from './httpService';

const apiEndpoint = '/publicPuzzles';

const getPuzzles = () => {
    return http.get(apiEndpoint);
};

const convertToGame = (puzzle) => {
    return http.post(apiEndpoint + '/convert', puzzle);
};

export { getPuzzles, convertToGame };
