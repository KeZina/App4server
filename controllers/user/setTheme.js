const User = require('../../model/User');

const setTheme = async ({name, theme}) => {
    try {
        const user = await User.findOne({name});
        await user.changeTheme(theme);

    } catch(e) {
        console.log(e);
    }
}

module.exports = setTheme;