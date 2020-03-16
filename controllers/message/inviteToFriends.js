const users = require('../counter/users');

const inviteToFriends = data => {
    try {
        const user = users.getUser(data.targetUser);
        
        if(!user) throw new Error('no such user');

        user.emit('message', {
            type0: 'note',
            type1: 'inviteToFriends',
            content: `User ${data.currentUser} want to be your friend :)`,
            currentUser: data.currentUser,
            targetUser: data.targetUser
        })
    } catch(e) {
        console.log(e);
    }
}

module.exports = inviteToFriends;