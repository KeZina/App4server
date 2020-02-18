const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const counter = require('../counter');

const deleteAcc = async (data, ws) => {
    try {
        const {name, token} = data;
        const verToken = jwt.verify(token, config.get('jwtSecret'));

        await User.deleteOne({_id: verToken._id});

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

module.exports = deleteAcc;