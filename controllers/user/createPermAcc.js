const User = require('../../model/User');

const createTempAcc = async (socket, data) => {
    try {
        const {name, password} = data;
        const isNameTaken = await User.findOne({name});

        if(!isNameTaken) {
            const user = new User({
                name,
                token: ''
            })
            
            await user.addHash(password);
            await user.addToken();

            socket.emit('user', {
                type: 'auth',
                auth: {
                    temp: false,
                    perm: true
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