const User = require('../../model/User');

const login = async (socket, {name, pass}) => {
    try {
        const user = await User.findOne({name});

        if(user) {
            const isHash = user.compareHash(pass);
            if(isHash) {
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
            } else if(!isHash) throw new Error('wrong name or password');
        } else if(!user) throw new Error('wrong name or password');

    } catch(e) {
        console.log(e);

        socket.emit('user', {
            type: 'error',
            message: e.message
        })
    }
}

module.exports = login;