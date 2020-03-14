const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../model/User');

const logout = async (socket, {token}) => {
    try {
        const verToken = jwt.verify(token, config.get('jwtSecret'));

        if(verToken.auth.perm) await User.updateOne({_id: verToken._id}, {token: ' '});
        else if (verToken.auth.temp) await User.deleteOne({_id: verToken._id});
        
    } catch(e) {
        console.log(e);

        socket.emit('user', {
            type: 'error',
            message: e.message
        })
    }
}

module.exports = logout;