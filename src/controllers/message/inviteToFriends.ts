const {User} = require('../../model/User');
const users = require('../counter/Users');

export const inviteToFriends = async (currentUser: string, targetUser: string) => {
    try {
        if(targetUser === currentUser) {
            throw new Error('you can`t be friend for yourself :)');
        }

        const target: any = await User.findOne({name: targetUser});
        if(!target) {
            throw new Error('no such user');
        }

        const targetUserSocket: any = users.getUser(targetUser);
        if(!targetUserSocket) {
            throw new Error('user is not online, try later');
        }

        const current: any = await User.findOne({name: currentUser});
        if(current.haveSuchFriend(targetUser)) {
            throw new Error('you already friends');
        }

        targetUserSocket.emit('message', {
            type0: 'note',
            type1: 'inviteToFriends',
            content: `User ${currentUser} want to be your friend :)`,
            current: currentUser,
            target: targetUser
        })
    } catch(e) {
        console.log(e);
    }
}