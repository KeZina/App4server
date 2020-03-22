const {Room} = require('../../model/Room');

export const enterRoom = async (socket: any, roomUrl: string): Promise<void> => {
    try {
        const room: any = await Room.findById(roomUrl); 

        if(room) {
            socket.emit('room', {
                type: 'enterRoom',
                name: room.name
            })
            socket.emit('message', {
                type0: 'roomMessages',
                messages: room.getMessages()
            })
        } else if(!room) throw new Error('no such room');
    } catch(e) {
        console.log(e);
    }
}