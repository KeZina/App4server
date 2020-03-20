const User = require('../../model/User');

const createPrivateMessage = async (data) => {
    try{
        const {content, title, currentUser, targetUser} = data
        if(currentUser === targetUser) {
            throw new Error(('for what send message to yourself? :)'))
        }

        const user = await User.findOne({name: targetUser});
        if(!user) {
            throw new Error('no such user');
        }

        await user.addMessage({
            title,
            content,
            sender: currentUser
        });

        return user.getMessages();
    } catch(e) {
        console.log(e);
    }
}

module.exports = createPrivateMessage;