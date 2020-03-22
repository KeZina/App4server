const User = require('../../model/User');

interface iMessages {
    title: string;
    content: string;
    date: string;
}

export const getPrivateMessages = async (socket: any, currentUser: string, targetUser: string): Promise<void> => {
    try {
        const user: any = await User.findOne({name: currentUser});

        const messages: Array<iMessages> = user.getMessages(targetUser);

        socket.emit('message', {
            type0: 'privateMessages',
            messages
        })

    } catch(e) {
        console.log(e);
    }
}