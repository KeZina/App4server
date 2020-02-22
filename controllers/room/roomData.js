const Room = require('../../model/Room');

const roomData = async (socket, data) => {
    try {
        const { roomUrl } = data;
        const roomData = await Room.findById(roomUrl); 

        if(roomData) {
            socket.emit('room', {
                type: 'roomData',
                name: roomData.name,
                messages: roomData.messages
            })
        } else if(!roomData) throw new Error('no such room');
    } catch(e) {
        console.log(e);

        socket.emit('room', {
            type: 'error',
            message: e.message
        })
    }
}

module.exports = roomData;