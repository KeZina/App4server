const siteUsers = {
    users: [],
    addUsers(socket, {name}) {
        const isUserSet = this.users.filter(user => user.name === name);
        if(isUserSet.length === 0) this.users.push({socket, name});
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

module.exports = siteUsers;