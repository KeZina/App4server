const counter = {
    usersInSite: [],
    usersInRooms: {},
    addSocketInSite: function(socket) {
        this.usersInSite.push({socket});
    },
    addUsersInSite: function(user) {
        this.usersInSite.map((item, index) => {
            if(item.name === user) {
                this.usersInSite.splice(index, 1);
            }
        })
        
        this.usersInSite[this.usersInSite.length - 1].name = user;
    },
    removeUsersInSite: function(user) {
        if(this.usersInSite) {
            this.usersInSite.map((item, index) => {
                if(item.name === user) {
                    this.usersInSite.splice(index, 1);
                }
            })
        }
    },
    getUsersInSite: function() {
        return this.usersInSite;
    },
    addUsersInRooms: function(roomUrl, user) {
        if(this.usersInRooms[roomUrl]) {
            if(this.usersInRooms[roomUrl].includes(user)){
                return;
            }
            this.usersInRooms[roomUrl].push(user);
        } else if(!this.usersInRooms[roomUrl]) {
            this.usersInRooms[roomUrl] = [];
            this.usersInRooms[roomUrl].push(user);
        }
    },
    removeUsersInRooms: function(roomUrl, user = null) {
        if(user) {
            let usersList = this.usersInRooms[roomUrl].filter(item => item !== user);
            this.usersInRooms[roomUrl] = usersList;
        } else if(!user) {
            let usersList = this.usersInRooms[roomUrl].filter(item => item.name);
            this.usersInRooms[roomUrl] = usersList;
        }
    },
    getUsersInRooms: function() {
        return this.usersInRooms;
    },
    clearEmpty: function() {
        let totalUsersList = this.usersInSite.filter(item => item.name);
        this.usersInSite = totalUsersList;
    }
}


module.exports = counter;