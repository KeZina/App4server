const Room = require('../../model/Room');

export const createRoom = async (socket: any, name: string): Promise<void> => {
    try {
        const isNameTaken: any = await Room.findOne({name});

        if(!isNameTaken) {
            const room: any = new Room({
                name
            });
            await room.save();

            socket.emit('room', {
                type: 'createRoom',
                name,
                roomUrl: room._id
            })
            socket.emit('message', {
                type: 'roomMessages',
                messages: []
            })

        } else if(isNameTaken) throw new Error('such room already exists');
    } catch(e) {
        console.log(e);
    }

}