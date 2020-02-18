const Room = require('../../models/Room');

const getRoomList = async (ws) => {
    try {
        const list = await Room.find({});
        const correctList = list.map(room => {
            return {
                name: room.name,
                roomUrl: room._id
            }
        });

        if(list) {
            ws.send(JSON.stringify({
                handler: 'room',
                type: 'getRoomList',
                list: correctList,
                success: true
            }))
        } else if(!list) {
            throw new Error('No rooms there');
        }
    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'room',
            type: 'getRoomList',
            message: e,
            success: false
        }))
    }
}

module.exports = getRoomList;