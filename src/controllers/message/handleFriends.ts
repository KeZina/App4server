const {User} = require('../../model/User');
const users = require('../counter/Users');

export const handleFriends = async (currentUser: string, targetUser: string, reason: string): Promise<void> => {
    try {
        const crnt: string = currentUser;
        const trgt: string = targetUser;

        const current: any = await User.findOne({name: crnt});
        const target: any = await User.findOne({name: trgt});

        if(reason === 'add') {
            await current.addFriend(trgt);
            await target.addFriend(crnt);
        } else if(reason === 'remove') {
            await current.removeFriend(trgt);
            await target.removeFriend(crnt);
        }
        
        const currentSocket: any = users.getUser(crnt);
        const targetSocket: any = users.getUser(trgt);

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