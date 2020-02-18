const Room = require('../../models/Room');
const counter = require('../counter');

const getRoom = async (data, ws, sendToAll) => {
    try {
        const room = await Room.findById(data.roomUrl);

        if(room) {
            counter.addUsersInRooms(data.roomUrl, data.user);
            ws.send(JSON.stringify({
                handler: 'room',
                type: 'getRoom',
                name: room.name,
                roomUrl: data.roomUrl,
                success: true
            }))

            sendToAll('counter', 'usersInRooms', counter.getUsersInRooms());
        } else if(!room) {
            throw new Error('Wrong url');
        }
    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'room',
            type: 'getRoom',
            message: e,
            success: false
        }))
    }
}

module.exports = getRoom;