const User = require('../../model/User');

const users = {
    users: [],
    addUser(socket, name, roomUrl = null) {
        const users = this.users.filter(user => user.name !== name);

        socket.name = name;
        socket.roomUrl = roomUrl;

        this.users = [...users, socket];
    },
    updateUser(socket, name, reason, roomUrl = null) {
        // bicycle :)
        if(this.users.length === 0) return;

        const user = this.users.filter(user => user.name === name);
        const users = this.users.filter(user => user.name !== name);

        if(reason === 'enter') {
            socket.join(roomUrl);
            user[0].roomUrl = roomUrl;
        } else if(reason === 'exit') {
            socket.leave(roomUrl);
            user[0].roomUrl = null;
        }

        this.users = [...users, ...user];
    },
    removeUser(name) {
        if(this.users.length === 0) return;
        
        const users = this.users.filter(user => user.name !== name);
        this.users = users;
    },
    getUser(name) {
        const user = this.users.filter(user => user.name === name);
        return user[0];
    },
    getUsers() {
        const users = this.users.map(user => user.name);
        return users;
    },
    getRoomUsers(roomUrl) {
        const roomUsers = this.users.filter(user => user.roomUrl === roomUrl);
        const users = roomUsers.map(user => user.name);

        return users;
    },
    async getRegisteredUsers() {
        const usersData = await User.find();
        const users = usersData.map(user => {
            let {name, dateOfRegistry} = user;
            return {
                name,
                dateOfRegistry: new Date(dateOfRegistry).toDateString()
            }
        })
        return users;
    }
}

module.exports = users;