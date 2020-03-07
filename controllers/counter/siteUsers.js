const siteUsers = {
    users: [],
    addUsers(socket, {name}) {
        const users = this.users.filter(user => user.name !== name);
        this.users = [...users, {socket, name}];
    },
    removeUsers({name}) {
        const users = this.users.filter(user => user.name !== name);
        this.users = users;
    },
    getUsers() {
        const users = this.users.map(user => user.name);
        return users;
    },
    getUserSocket({name}) {
        const user = this.users.filter(user => user.name === name);
        return user[0].socket;
    }
}

module.exports = siteUsers;