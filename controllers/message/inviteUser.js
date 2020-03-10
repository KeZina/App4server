const users = require('../counter/users');
const Room = require('../../model/Room')

const inviteUser = async data => {
    try {
        const user = users.getUser(data);
        const room = await Room.findOne({name: data.room});
        
        if(!user) throw new Error('no such user');

        user.emit('message', {
            type: 'note',
            content: `User ${data.sender} invite you into room ${data.room}`,
            roomUrl: room._id
        })
    } catch(e) {
        console.log(e);
    }
}

module.exports = inviteUser;