const Room = require('../../model/Room');

const enterRoom = async (socket, data) => {
    try {
        const { roomUrl } = data;
        const room = await Room.findById(roomUrl); 

        if(room) {
            socket.emit('room', {
                type: 'enterRoom',
                name: room.name,
                messages: room.messages
            })
        } else if(!room) throw new Error('no such room');
    } catch(e) {
        console.log(e);

        socket.emit('room', {
            type: 'error',
            message: e.message
        })
    }
}

module.exports = enterRoom;