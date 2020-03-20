const User = require('../../model/User');
const users = require('../counter/users');

const handleFriends = async data => {
    try {
        const crnt = data.current;
        const trgt = data.target;

        const current = await User.findOne({name: crnt});
        const target = await User.findOne({name: trgt});

        if(data.action === 'add') {
            await current.addFriend(trgt);
            await target.addFriend(crnt);
        } else if(data.action === 'remove') {
            await current.removeFriend(trgt);
            await target.removeFriend(crnt);
        }
        
        const currentSocket = users.getUser(crnt);
        const targetSocket = users.getUser(trgt);

        currentSocket.emit('counter', {
            type: 'registeredUsers',
            users: await users.getRegisteredUsers(crnt)
        })
        if(targetSocket) {
            targetSocket.emit('counter', {
                type: 'registeredUsers',
                users: await users.getRegisteredUsers(trgt)
            })
        }
    } catch(e) {
        console.log(e);
    }
}

module.exports = handleFriends;