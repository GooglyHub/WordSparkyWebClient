import http from './httpService';

const apiEndpoint = '/games';

const addGame = (game) => {
    return http.post(apiEndpoint, game);
};

const addGameForBot = (game) => {
    return http.post(apiEndpoint + '/sparkybot', game);
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

const deleteGame = (game) => {
    return http.post(apiEndpoint + '/del', game);
};

const revealLetter = (data) => {
    return http.get(apiEndpoint + '/reveal', { params: data });
};

export {
    addGame,
    addGameForBot,
    getGames,
    guessLetters,
    solvePuzzle,
    viewSolve,
    deleteGame,
    revealLetter,
};
