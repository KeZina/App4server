const User = require('../../model/User');

export const login = async (socket: any, name: string, password: string): Promise<void> => {
    try {
        const user: any = await User.findOne({name});

        if(user) {
            const isHash: boolean = user.compareHash(password);
            if(isHash) {
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
            } else if(!isHash) throw new Error('wrong name or password');
        } else if(!user) throw new Error('wrong name or password');

    } catch(e) {
        console.log(e);

        socket.emit('user', {
            type: 'error',
            message: e.message
        })
    }
}