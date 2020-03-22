const {users} = require('../counter/Users');
const {Room} = require('../../model/Room');

export const inviteToRoom = async (currentUser: string, targetUser: string, name: string): Promise<void> => {
    try {
        const user: any = users.getUser(targetUser);
        const room: any = await Room.findOne({name});
        
        if(!user) throw new Error('no such user');

        user.emit('message', {
            type0: 'note',
            type1: 'inviteToRoom',
            content: `User ${currentUser} invite you into room ${name}`,
            roomUrl: room._id
        })
    } catch(e) {
        console.log(e);
    }
}