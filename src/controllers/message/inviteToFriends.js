const User = require('../../model/User');
const users = require('../counter/users');

const inviteToFriends = async data => {
    try {
        if(data.target === data.current) {
            throw new Error('you can`t be friend for yourself :)');
        }

        const target = await User.findOne({name: data.target});
        if(!target) {
            throw new Error('no such user');
        }

        const targetUserSocket = users.getUser(data.target);
        if(!targetUserSocket) {
            throw new Error('user is not online, try later');
        }

        const current = await User.findOne({name: data.current});
        if(current.haveSuchFriend(data.target)) {
            throw new Error('you already friends');
        }

        targetUserSocket.emit('message', {
            type0: 'note',
            type1: 'inviteToFriends',
            content: `User ${data.current} want to be your friend :)`,
            current: data.current,
            target: data.target
        })
    } catch(e) {
        console.log(e);
    }
}

module.exports = inviteToFriends;