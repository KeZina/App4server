const {Room} = require('../../model/Room');

export const roomList = async (socket: any): Promise<void> => {
    try {
        const roomList: any = await Room.find({});

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