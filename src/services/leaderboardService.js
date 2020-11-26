import http from './httpService';

const apiEndpoint = '/leaderboard';

const getLeaderboard = () => {
    return http.get(apiEndpoint);
};

export { getLeaderboard };
