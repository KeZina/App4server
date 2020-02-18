const Room = require('../../models/Room')

const createMessage = {
    messages: [],
    addMessage: async function(data){
        try {
            const {content, date, sender, roomUrl} = data;

            const room = await Room.findById(roomUrl);
            await room.addMessage(content, date, sender);

            this.messages = room.messages;
        } catch(e) {
            console.log(e);
        }
    },
    getMessage: function(){
        return this.messages;
    }
}


module.exports = createMessage;