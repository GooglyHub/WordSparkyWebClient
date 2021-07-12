import gameStates from '../common/gameStates';
import http from './httpService';

const apiEndpoint = '/games';

// The ids start at 0.
// The array starts with the bot games followed by games
// that the guest created for SparkyBot.
// Games are never deleted.
let guestGames = [];

const addGame = (game) => {
    return http.post(apiEndpoint, game);
};

const addGameForBot = (game) => {
    return http.post(apiEndpoint + '/sparkybot', game);
};

const addGameForBotAsGuest = async (game) => {
    const res = await http.post(apiEndpoint + '/sparkybot/guest', game);
    const newId = `${guestGames.length}`;
    guestGames.push({ ...res.data, _id: newId });
    return res;
};

const getGames = () => {
    return http.get(apiEndpoint);
};

const getGamesGuest = async () => {
    if (guestGames.length > 0) {
        return guestGames;
    }
    const resp = await http.get(apiEndpoint + '/guest');
    for (let i = 0; i < resp.data.length; ++i) {
        guestGames.push(resp.data[i]);
    }
    return guestGames;
};

const guessLetters = (data) => {
    return http.post(apiEndpoint + '/guess', data);
};

const guessLettersGuest = (gameId, letters) => {
    for (let i = 0; i < guestGames.length; ++i) {
        if (
            guestGames[i]._id === gameId &&
            guestGames[i].state === gameStates.NEW
        ) {
            // Simulate the server
            let guessedMessage = '';
            const answer = guestGames[i].answer;
            for (let i = 0; i < answer.length; ++i) {
                if (answer[i] >= 'A' && answer[i] <= 'Z') {
                    if (letters.indexOf(answer[i]) >= 0)
                        guessedMessage += answer[i];
                    else guessedMessage += '*';
                } else {
                    guessedMessage += answer[i];
                }
            }
            guestGames[i].state =
                guessedMessage === answer
                    ? gameStates.SOLVED
                    : gameStates.SOLVING;
            guestGames[i].guessedLetters = [letters];
            guestGames[i].guesses.push(guessedMessage);
            guestGames[i].active = true;
            return guestGames[i];
        }
    }
};

const solvePuzzle = (data) => {
    return http.post(apiEndpoint + '/solve', data);
};

const solvePuzzleGuest = (gameId, letters) => {
    for (let j = 0; j < guestGames.length; ++j) {
        if (
            guestGames[j]._id === gameId &&
            guestGames[j].state === gameStates.SOLVING
        ) {
            // simulate the server
            let nextGuess = '';
            let cursor = 0;
            const lastGuess =
                guestGames[j].guesses[guestGames[j].guesses.length - 1];
            for (let i = 0; i < lastGuess.length; ++i) {
                if (lastGuess[i] !== '*') {
                    nextGuess += lastGuess[i];
                } else {
                    if (guestGames[j].answer[i] === letters[cursor]) {
                        nextGuess += guestGames[j].answer[i];
                    } else {
                        nextGuess += '*';
                    }
                    ++cursor;
                }
            }
            guestGames[j].guessedLetters.push(letters);
            guestGames[j].guesses.push(nextGuess);
            guestGames[j].state =
                nextGuess === guestGames[j].answer
                    ? gameStates.SOLVED
                    : gameStates.SOLVING;
            guestGames[j].active = true;
            return guestGames[j];
        }
    }
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

const toggleExpansion = (gameId, expanded) => {
    for (let i = 0; i < guestGames.length; ++i) {
        if (guestGames[i]._id === gameId) {
            guestGames[i].active = expanded;
        }
    }
};

export {
    addGame,
    addGameForBot,
    addGameForBotAsGuest,
    getGames,
    getGamesGuest,
    guessLetters,
    guessLettersGuest,
    solvePuzzle,
    solvePuzzleGuest,
    viewSolve,
    deleteGame,
    revealLetter,
    toggleExpansion,
};
