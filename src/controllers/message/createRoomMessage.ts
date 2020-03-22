const Room = require('../../model/Room');

interface iMessages {
    content: string;
    sender: string;
    date: string;
}

export const createRoomMessage = async (content: string, currentUser: string, roomUrl: string): Promise<iMessages | void> => {
    try{
        const room: any = await Room.findById(roomUrl);

        await room.addMessage({
            content,
            sender: currentUser
        });

        return room.getMessages();
    } catch(e) {
        console.log(e);
    }
}
