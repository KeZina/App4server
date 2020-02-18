const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const counter = require('../counter');


const checkAuth = async (data, ws) => {
    try {
        const verToken = jwt.verify(data.token, config.get('jwtSecret'));
        const user = await User.findById(verToken._id);

        if(user) {
            if(user.hash){
                counter.addUsersInSite(user.name);
                ws.send(JSON.stringify({
                    handler: 'user',
                    type: 'auth', 
                    auth: {
                        temp: false,
                        perm: true
                    }, 
                    name: user.name,
                }))
            } else if(!user.hash) {
                counter.addUsersInSite(user.name);
                ws.send(JSON.stringify({
                    handler: 'user',
                    type: 'auth', 
                    auth: {
                        temp: true,
                        perm: false
                    }, 
                    name: user.name,
                }))
            }
        } else if(!user) {
            counter.removeUsersInSite(data.name);
            ws.send(JSON.stringify({
                handler: 'user',
                type: 'auth', 
                auth: false
            }))
        } else throw new Error();

    } catch(e) {
        console.log(e);

        counter.removeUsersInSite(user.name);
        ws.send(JSON.stringify({
            handler: 'user',
            type: 'auth', 
            auth: false,
            message: e.message,
        }))
    }
}

module.exports = checkAuth;