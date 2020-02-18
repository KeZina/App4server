const Room = require('../../models/Room');

const createRoom = async (data, ws) => {
    try {
        const {name} = data;
        const nameIsTaken = await Room.findOne({name});

        if(nameIsTaken) {
            ws.send(JSON.stringify({
                handler: 'room',
                type: 'createRoom',
                success: false,
                message: 'name is already exists'
            }))
        } else if (!nameIsTaken) {
            const room = new Room({
                name
            })

            await room.save();

            ws.send(JSON.stringify({
                handler: 'room',
                type: 'createRoom',
                success: true,
                name,
                token: room.token,
                roomUrl: room._id
            }))
        }
    } catch(e) {
        console.log(e); 

        ws.send(JSON.stringify({
            handler: 'room',
            type: 'createRoom',
            message: e,
            success: false
        }))
    }

}

module.exports = createRoom;