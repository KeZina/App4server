const User = require('../../model/User');

export const setTheme = async (name: string, theme: string): Promise<void> => {
    try {
        const user: any = await User.findOne({name});
        await user.changeTheme(theme);

    } catch(e) {
        console.log(e);
    }
}