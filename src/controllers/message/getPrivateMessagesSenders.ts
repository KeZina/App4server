const User = require('../../model/User');

export const getPrivateMessagesSenders = async (socket: any, currentUser: string): Promise<void> => {
    try {
        const user: any = await User.findOne({name: currentUser});

        const senders: Array<string> = user.getSenders();

        socket.emit('message', {
            type0: 'privateMessagesSenders',
            senders
        })

    } catch(e) {
        console.log(e);
    }
}