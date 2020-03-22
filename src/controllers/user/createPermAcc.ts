const User = require('../../model/User');

export const createTempAcc = async (socket: any, name: string, password: string): Promise<void> => {
    try {
        const isNameTaken: any = await User.findOne({name});

        if(!isNameTaken) {
            const user: any = new User({
                name,
                token: ''
            })
            
            await user.addHash(password);
            await user.addToken();

            socket.emit('user', {
                type: 'auth',
                auth: {
                    temp: false,
                    perm: true
                },
                name,
                theme: user.theme,
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