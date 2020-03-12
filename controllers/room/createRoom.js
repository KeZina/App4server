const Room = require('../../model/Room');

const createRoom = async (socket, {name}) => {
    try {
        const isNameTaken = await Room.findOne({name});

        if(!isNameTaken) {
            const room = new Room({
                name
            });
            await room.save();

            socket.emit('room', {
                type: 'createRoom',
                name,
                roomUrl: room._id
            })

        } else if(isNameTaken) throw new Error('such room already exists');
    } catch(e) {
        console.log(e);


    }

}

module.exports = createRoom;