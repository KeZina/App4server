const users = require('../counter/users');

const inviteUser = async data => {
    try {
        const user = users.getUser(data);
        
        if(!user) throw new Error('no such user');

        user.socket.emit('message', {
            type: 'inviteToRoom',
            content: null
        })
    } catch(e) {
        console.log(e);
    }
}

module.exports = inviteUser;