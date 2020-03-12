const User = require('../../model/User');

const createTempAcc = async (socket, {name}) => {
    try {
        const isNameTaken = await User.findOne({name});

        if(!isNameTaken) {
            const user = new User({
                name,
                token: ' '
            })
            
            await user.addToken();

            socket.emit('user', {
                type: 'auth',
                auth: {
                    temp: true,
                    perm: false
                },
                name,
                token: user.token
            })
        } else if(isNameTaken) throw new Error('this name already taken');

    } catch(e) {
        console.log(e);

        socket.emit('user', {
            type: 'error',
            message: e.message
        })
    }
}

module.exports = createTempAcc;