const User = require('../../models/User');
const counter = require('../counter');

const login = async (data, ws) => {
    try {
        const {name, password} = data;
        const user = await User.findOne({name});

        if(user) {
            const hash = await user.compareHash(password);
            if(hash) {
                await user.addToken();

                counter.addUsersInSite(user.name);
                ws.send(JSON.stringify({
                    handler: 'user',
                    type: 'login',
                    auth: {
                        temp: false,
                        perm: true
                    },
                    name: user.name,
                    token: user.token,
                }))
            } else if(!hash){
                ws.send(JSON.stringify({
                    handler: 'user',
                    type: 'login', 
                    auth: false
                }))
            } else {
                throw new Error();
            }
        } else if(!user) {
            ws.send(JSON.stringify({
                handler: 'user',
                type: 'login', 
                auth: false
            }))
        } else {
            throw new Error();
        }
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

module.exports = login;