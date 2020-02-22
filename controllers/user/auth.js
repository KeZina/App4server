const jwt = require('jsonwebtoken');
const config = require('config');

const auth = async (socket, data) => {
    try {
        const {token} = data;
        const verToken = jwt.verify(token, config.get('jwtSecret'));

        socket.emit('user', {
            type: 'auth',
            auth: verToken.auth,
            name,
        })
    } catch(e) {
        console.log(e);

        socket.emit('user', {
            type: 'error',
            message: e.message
        })
    }
}

module.exports = auth;