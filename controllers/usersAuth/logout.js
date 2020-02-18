const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const counter = require('../counter');

const logout = async (data, ws) => {
    try {
        const {name, token, roomUrl} = data;
        const verToken = jwt.verify(token, config.get('jwtSecret'));

        if(data.authType === 'temp') {
            await User.deleteOne({_id: verToken._id});
        } else if(data.authType === 'perm') {
            await User.updateOne({_id: verToken._id}, {token: ""});
        }

        counter.removeUsersInSite(name);
        if(roomUrl) {
            counter.removeUsersInRooms(roomUrl, name)
        }
        ws.send(JSON.stringify({
            handler: 'user',
            type: 'auth',
            auth: false,
        }))
    } catch(e) {
        console.log(e);

        ws.send(JSON.stringify({
            handler: 'user',
            type: 'auth', 
            auth: false,
            message: e
        }))
    }
}

module.exports = logout;