const users = require('../counter/users');
const Room = require('../../model/Room')

const inviteToRoom = async data => {
    try {
        const user = users.getUser(data.targetUser);
        const room = await Room.findOne({name: data.room});
        
        if(!user) throw new Error('no such user');

        user.emit('message', {
            type0: 'note',
            type1: 'inviteToRoom',
            content: `User ${data.currentUser} invite you into room ${data.room}`,
            roomUrl: room._id
        })
    } catch(e) {
        console.log(e);
    }
}

module.exports = inviteToRoom;