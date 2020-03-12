const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../model/User');

const auth = async (socket, {token}) => {
    try {
        const verToken = jwt.verify(token, config.get('jwtSecret'));

        socket.emit('user', {
            type: 'auth',
            auth: verToken.auth,
            name: verToken.name
        })
    } catch(e) {
        console.log(e);

        const user = await User.findOne({token});
        if(user.hash) {
            await User.updateOne({token}, {token: ' '});
        } else if(!user.hash) {
            await User.deleteOne({token});
        }

        socket.emit('user', {
            type: 'auth',
            auth: {
                temp: false,
                perm: false
            }
        })
    }
}

module.exports = auth;