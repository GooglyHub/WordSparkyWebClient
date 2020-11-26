import http from './httpService';

const apiEndpoint = '/games';

const addGame = (game) => {
    return http.post(apiEndpoint, game);
};

const getGames = () => {
    return http.get(apiEndpoint);
};

const guessLetters = (data) => {
    return http.post(apiEndpoint + '/guess', data);
};

const solvePuzzle = (data) => {
    return http.post(apiEndpoint + '/solve', data);
};

const viewSolve = (game) => {
    return http.post(apiEndpoint + '/view', game);
};

export { addGame, getGames, guessLetters, solvePuzzle, viewSolve };
