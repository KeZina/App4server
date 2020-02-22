const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../model/User');

const logout = async (socket, data) => {
    try {
        const {token} = data;
        const verToken = jwt.verify(token, config.get('jwtSecret'));

        if(verToken.auth.perm) await User.updateOne({_id: verToken._id}, {token: ' '});
        else if (verToken.auth.temp) await User.deleteOne({_id: verToken._id});
        else throw new Error('no such user');

        socket.emit('user', {
            type: 'auth',
            auth: {
                temp: false,
                perm: false
            },
            name: null
        })
    } catch(e) {
        console.log(e);

        socket.emit('user', {
            type: 'error',
            message: e.message
        })
    }
}

module.exports = logout;