const Room = require('../../model/Room');

const createRoomMessage = async (content, currentUser, roomUrl) => {
    try{
        const room = await Room.findById(roomUrl);

        await room.addMessage({
            content,
            sender: currentUser
        });

        return room.getMessages();
    } catch(e) {
        console.log(e);
    }
}

module.exports = createRoomMessage;