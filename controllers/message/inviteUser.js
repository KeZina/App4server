const siteUsers = require('../counter/siteUsers');

const inviteUser = async data => {
    try {
        const socket = siteUsers.getUserSocket(data);
        
        if(!socket) throw new Error('no such user');

        socket.emit('message', {
            type0: 'notification',
            type1: 'inviteToRoom',
            content: null
        })
    } catch(e) {
        console.log(e);
    }
}

module.exports = inviteUser;