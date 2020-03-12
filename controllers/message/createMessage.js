const Room = require('../../model/Room');

const createMessage = async ({content, sender, roomUrl}) => {
    try{
        const room = await Room.findById(roomUrl);

        await room.addMessage({
            content,
            sender,
            date: Date.now()
        });

        return room.getMessages();
    } catch(e) {
        console.log(e);
    }
}

module.exports = createMessage;