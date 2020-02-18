const counter = require('../counter');

const exitRoom = async (data, sendToAll) => {
    try {
        counter.removeUsersInRooms(data.roomUrl, data.user)

        sendToAll('counter', 'usersInRooms', counter.getUsersInRooms());
    } catch(e) {
        console.log(e);
    }
}

module.exports = exitRoom;