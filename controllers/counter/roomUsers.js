const roomUsers = {
    users: [],
    addUsers({roomUrl, name}) {
        const users = this.users.filter(user => user.name !== name);
        this.users = [...users, {roomUrl, name}];
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