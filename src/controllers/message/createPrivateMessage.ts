const User = require('../../model/User');

export const createPrivateMessage = async (content: string, title: string, currentUser: string, targetUser: string): Promise<void> => {
    try{
        if(currentUser === targetUser) {
            throw new Error(('for what send message to yourself? :)'))
        }

        const user: any = await User.findOne({name: targetUser});
        if(!user) {
            throw new Error('no such user');
        }

        await user.addMessage({
            title,
            content,
            sender: currentUser
        });

        // return user.getMessages();
    } catch(e) {
        console.log(e);
    }
}