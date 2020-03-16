const User = require('../../model/User');

const addToFriends = async data => {
    try {
        const currentUser = await User.findOne({name: data.currentUser});
        const targetUser = await User.findOne({name: data.targetUser});

        console.log(data)

        await currentUser.addFriend(data.targetUser);
        await targetUser.addFriend(data.currentUser);
    } catch(e) {
        console.log(e);
    }
}

module.exports = addToFriends;