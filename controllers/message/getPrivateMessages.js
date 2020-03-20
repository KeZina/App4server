const User = require('../../model/User');

const getPrivateMessages = async (socket, data) => {
    try {
        const user = await User.findOne({name: data.currentUser});

        const messages = user.getMessages(data.targetUser);

        socket.emit('message', {
            type0: 'privateMessages',
            messages
        })

    } catch(e) {
        console.log(e);
    }
}

module.exports = getPrivateMessages;