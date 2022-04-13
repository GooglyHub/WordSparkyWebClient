export default {
    getUsername: (user) => {
        if (user) {
            return user.username;
        } else {
            return 'Guest';
        }
    },

    getIcon: (user) => {
        if (user && user.isPremium) {
            return user.icon;
        } else if (user) {
            return 'account';
        } else {
            return 'account-question';
        }
    },

    getColor: (user) => {
        if (user && user.isPremium) {
            return user.color;
        } else if (user) {
            return 'blue';
        } else {
            return 'blue';
        }
    },
};
