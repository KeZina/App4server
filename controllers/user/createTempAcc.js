const User = require('../../model/User');

const createTempAcc = async (socket, data) => {
    try {
        const {name} = data;
        const isNameTaken = await User.findOne({name});

        if(isNameTaken) {
            socket.emit('user', {
                type: 'createAcc',
                auth: {
                    temp: false,
                    perm: false
                },
                message: 'This name already taken'
            })
        } else if(!isNameTaken) {
            const user = new User({
                name,
                token: ''
            })
            user.addToken();
            await user.save();

            socket.emit('user', {
                type: 'createAcc',
                auth: {
                    temp: true,
                    perm: false
                },
                name,
                token: user.token
            })
        }

    } catch(e) {
        console.log(e);
    }
}

module.exports = createTempAcc;