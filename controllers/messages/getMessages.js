const Room = require('../../models/Room');

const getMessage = async (data, ws) => {
    try {
        const room = await Room.findById(data.roomUrl);

        if(room) {
            ws.send(JSON.stringify({
                handler: 'message',
                type: 'getMessage',
                content: room.messages,
                success: true
            }))
        } else if(!room) {
            throw new Error('Wrong url')
        }

    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'message',
            type: 'getMessage',
            message: e,
            success: false
        }))
    }

}

module.exports = getMessage;