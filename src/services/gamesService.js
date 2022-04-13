import http from './httpService';

const apiEndpoint = '/games';

const addGame = (game) => {
    return http.post(apiEndpoint, game);
};

const getGames = () => {
    return http.get(apiEndpoint);
};

const getBotPuzzle = () => {
    return http.post(apiEndpoint + '/random');
};

const guessLetters = (data) => {
    return http.post(apiEndpoint + '/guess', data);
};

const guessLettersForBotPuzzle = (data) => {
    return http.post(apiEndpoint + '/guess/bot', data);
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

const rejectBotPuzzle = (botPuzzleId) => {
    return http.post(apiEndpoint + '/reject', { botPuzzleId });
};

const revealLetter = (data) => {
    return http.post(apiEndpoint + '/reveal', data);
};

export {
    addGame,
    getGames,
    getBotPuzzle,
    guessLetters,
    guessLettersForBotPuzzle,
    solvePuzzle,
    viewSolve,
    deleteGame,
    rejectBotPuzzle,
    revealLetter,
};
