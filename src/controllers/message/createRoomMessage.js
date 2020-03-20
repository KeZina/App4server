const Room = require('../../model/Room');

const createRoomMessage = async (data) => {
    try{
        const {content, currentUser, roomUrl} = data;
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