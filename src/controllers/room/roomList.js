const Room = require('../../model/Room');

const roomList = async (socket, data) => {
    try {
        const roomList = await Room.find({});

        if(roomList) {
            socket.emit('room', {
                type: 'roomList',
                roomList
            })
        } else if(!roomList) throw new Error('there`s no rooms');
    } catch(e) {
        console.log(e);

        socket.emit('room', {
            type: 'error',
            message: e.message
        })
    }

}

module.exports = roomList;