const roomUsers = {
    users: [],
    addUsers({name, roomUrl}) {
        const isUserSet = this.users.filter(user => user.name === name);
        if(isUserSet.length === 0) this.users.push({roomUrl, name});
    },
    removeUsers({name}) {
        const users = this.users.filter(user => user.name !== name);
        this.users = users;
    },
    getUsers() {
        const users = this.users.map(user => user.name);
        return users;
    }
}

module.exports = roomUsers;