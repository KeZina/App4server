const {User} = require('../../model/User');

export const createTempAcc = async (socket: any, name: string): Promise<void> => {
    try {
        const isNameTaken = await User.findOne({name});

        if(!isNameTaken) {
            const user: any = new User({
                name,
                token: ' '
            })
            
            await user.addToken();

            socket.emit('user', {
                type: 'auth',
                auth: {
                    temp: true,
                    perm: false
                },
                name,
                token: user.token
            })
        } else if(isNameTaken) throw new Error('this name already taken');

    } catch(e) {
        console.log(e);

        socket.emit('user', {
            type: 'error',
            message: e.message
        })
    }
}