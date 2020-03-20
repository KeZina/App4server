const User = require('../../model/User');

const getPrivateMessagesSenders = async (socket, data) => {
    try {
        const user = await User.findOne({name: data.currentUser});

        const senders = user.getSenders();

        socket.emit('message', {
            type0: 'privateMessagesSenders',
            senders
        })

    } catch(e) {
        console.log(e);
    }
}

module.exports = getPrivateMessagesSenders;