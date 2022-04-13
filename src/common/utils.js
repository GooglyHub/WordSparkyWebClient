const getBoardString = (guesses) => {
    return getBoardStringForString(
        guesses.length > 0 ? guesses[guesses.length - 1] : ''
    );
};

// Returns a string which is rows of x characters separated by |
const getBoardStringForString = (str) => {
    const WIDTH = 11;
    const tokens = str.split(' ');
    let tempBoard = [];
    let currRow = '';
    for (let i = 0; i < tokens.length; ++i) {
        if (currRow.length + tokens[i].length <= WIDTH) {
            currRow += tokens[i] + ' ';
        } else {
            if (currRow) tempBoard.push(currRow);
            let token = tokens[i];
            while (token.length > WIDTH) {
                tempBoard.push(token.substring(0, WIDTH));
                token = token.substring(WIDTH);
            }
            currRow = token + ' ';
        }
    }
    if (currRow) tempBoard.push(currRow);
    str = ''; // Re-use
    for (let i = 0; i < tempBoard.length; ++i) {
        tempBoard[i] = tempBoard[i].trim();
        let insertFront = false;
        while (tempBoard[i].length < WIDTH) {
            if (insertFront) tempBoard[i] = ' ' + tempBoard[i];
            else tempBoard[i] = tempBoard[i] + ' ';
            insertFront = !insertFront;
        }
        if (str) str += '|';
        str += tempBoard[i];
    }
    return str;
};

// Input board comes in as a string like "-ABC-|-DEF-"
// but GameComponent needs to read it as an 2d array of cells
// such as [ [ '-', 'A', 'B', 'C', '-' ], [ '-', 'D', 'E', 'F', '-' ] ]
const decompress = (s) => {
    let data = [];
    for (let token of s.split('|')) {
        let row = [];
        for (let i = 0; i < token.length; ++i) {
            if (token[i] === '*') {
                row.push({
                    state: 'unknown',
                    key: '?',
                    isPressable: false,
                });
            } else {
                row.push({
                    state: 'given',
                    key: token[i],
                    isPressable: false,
                });
            }
        }
        data.push(row);
    }
    return data;
};

const getAgeString = (x) => {
    const createTime = new Date(x);
    const now = new Date();
    const secs = Math.floor((now.getTime() - createTime.getTime()) / 1000);
    if (secs < 60) {
        if (secs < 1) return 'just now';
        if (secs === 1) return '1 second ago';
        return `${secs} seconds ago`;
    }
    const mins = Math.floor(secs / 60);
    if (mins < 60) {
        if (mins <= 1) return '1 minute ago';
        return `${mins} minutes ago`;
    }
    const hours = Math.floor(mins / 60);
    if (hours < 24) {
        if (hours <= 1) return `1 hour ago`;
        return `${hours} hours ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 365) {
        if (days <= 1) return '1 day ago';
        return `${days} days ago`;
    }
    const years = Math.floor(days / 365);
    if (years <= 1) return '1 year ago';
    return `${years} years ago`;
};

const randomString = (len, charSet) => {
    let str = '';
    for (let i = 0; i < len; i++) {
        const pos = Math.floor(Math.random() * charSet.length);
        str += charSet.substring(pos, pos + 1);
    }
    return str;
};

const utils = {
    decompress,
    getBoardString,
    getBoardStringForString,
    getAgeString,
};

export default utils;
