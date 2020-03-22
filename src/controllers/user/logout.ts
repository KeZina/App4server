const jwt = require('jsonwebtoken');
const config = require('config');
const {User} = require('../../model/User');

export const logout = async (token: string): Promise<void> => {
    try {
        const verToken: any = jwt.verify(token, config.get('jwtSecret'));

        if(verToken.auth.perm) await User.updateOne({_id: verToken._id}, {token: ' '});
        else if (verToken.auth.temp) await User.deleteOne({_id: verToken._id});
        
    } catch(e) {
        console.log(e);
    }
}