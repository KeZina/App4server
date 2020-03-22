// add nodemailer to confirm e-mail and maybe OAuth too
const http = require('http');
const socketIo = require('socket.io');
const config = require('config');
const mongoose = require('mongoose');
const chalk = require('chalk');

const {users} = require('./controllers/counter/Users');
// import Users from './controllers/counter/Users';

const {createTempAcc} = require('./controllers/user/createTempAcc');
const {createPermAcc} = require('./controllers/user/createPermAcc');
const {login} = require('./controllers/user/login');
const {logout} = require('./controllers/user/logout');
const {auth} = require('./controllers/user/auth');
const {setTheme} = require('./controllers/user/setTheme');

const {createRoom} = require('./controllers/room/createRoom');
const {roomList} = require('./controllers/room/roomList');
const {enterRoom} = require('./controllers/room/enterRoom');

const {inviteToRoom} = require('./controllers/message/inviteToRoom');
const {inviteToFriends} = require('./controllers/message/inviteToFriends');
const {handleFriends} = require('./controllers/message/handleFriends');
const {createRoomMessage} = require('./controllers/message/createRoomMessage');
const {createPrivateMessage} = require('./controllers/message/createPrivateMessage');
const {getPrivateMessagesSenders} = require('./controllers/message/getPrivateMessagesSenders');
const {getPrivateMessages} = require('./controllers/message/getPrivateMessages');

const server = http.createServer();
const io = socketIo(server);

const dbUrl: string = config.get('dbUrl');
const port: number = config.get('port');

interface iUserData {
    type: 
        'createTempAcc' |
        'createPermAcc' |
        'login' |
        'logout' |
        'auth' |
        'setTheme';
    token?: string;
    name?: string;
    password?: string;
    theme?: string;
}
interface iRoomData {
    type: 
        'createRoom' |
        'roomList' |
        'enterRoom';
    name?: string;
    roomUrl?: string;
}

interface iUsersData {
    type: 
        'createUser' |
        'updateUser' |
        'removeUser';
    goal: 
        'getSiteUsers' |
        'getRoomUsers' |
        'getRegisteredUsers' |
        'getAllUsers';
    name?: string;
    roomUrl?: string;
    reason?: string;
}

interface iMessageData {
    type:
        'inviteToRoom' |
        'inviteToFriends' |
        'handleFriends' |
        'createRoomMessage' |
        'createPrivateMessage' |
        'getPrivateMessagesSenders' |
        'getPrivateMessages';
    content?: string;
    title?: string;
    room?: string;
    roomUrl?: string;
    reason?: string;
    currentUser?: string;
    targetUser?: string;
}

io.on('connection', (socket: any): void => {
    console.log(chalk.bgGreen.red('+1 user :)'));

    socket.use((packet: any, next: any) => {
        console.log(packet);
        next();
    })

    socket.on('user', (data: iUserData): void => {
        if(data.type === 'createTempAcc') {
            createTempAcc(socket, data.name);
        } else if(data.type === 'createPermAcc') {
            createPermAcc(socket, data.name, data.password);
        } else if(data.type === 'login') {
            login(socket, data.name, data.password);
        } else if(data.type === 'logout') {
            logout(data.token);
        } else if(data.type === 'auth') {
            auth(socket, data.token);
        } else if(data.type === 'setTheme') {
            setTheme(data.name, data.theme);
        }
    })

    socket.on('room', (data: iRoomData): void => {
        if(data.type === 'createRoom') {
            createRoom(socket, data.name);
        } else if (data.type === 'roomList') {
            roomList(socket);
        } else if (data.type === 'enterRoom') {
            enterRoom(socket, data.roomUrl);
        }
    })

    socket.on('users', async (data: iUsersData): Promise<void> => {
        if(data.type === 'createUser') {
            users.createUser(socket, data.name, data.roomUrl);
        } else if(data.type === 'updateUser') {
            users.updateUser(socket, data.name, data.reason, data.roomUrl);
        } else if(data.type === 'removeUser') {
            users.removeUser(data.name);
        }

        if(data.goal === 'getSiteUsers') {
            io.emit('counter', {
                type: 'siteUsers',
                users: users.getUsers()
            })
        } else if(data.goal === 'getRoomUsers') {
            io.sockets.in(data.roomUrl).emit('counter', {
                type: 'roomUsers',
                users: users.getRoomUsers(data.roomUrl)
            })
        } else if(data.goal === 'getRegisteredUsers') {
            socket.emit('counter', {
                type: 'registeredUsers',
                users: await users.getRegisteredUsers(data.name)
            })
        } else if(data.goal === 'getAllUsers') {
            io.emit('counter', {
                type: 'siteUsers',
                users: users.getUsers()
            })
            io.sockets.in(data.roomUrl).emit('counter', {
                type: 'roomUsers',
                users: users.getRoomUsers(data.roomUrl)
            })
        }
    })

    socket.on('message', async (data: iMessageData): Promise<void> => {
        if(data.type === 'inviteToRoom') {
            inviteToRoom(data.currentUser, data.targetUser, data.room);
        } else if(data.type === 'inviteToFriends') {
            inviteToFriends(data.currentUser, data.targetUser);
        } else if(data.type === 'handleFriends') {
            handleFriends(data.currentUser, data.targetUser, data.reason);
        } else if(data.type === 'createRoomMessage') {
            io.sockets.in(data.roomUrl).emit('message', {
                type0: 'roomMessages',
                messages: await createRoomMessage(data.content, data.currentUser, data.roomUrl)
            })
        } else if(data.type === 'createPrivateMessage') {
            const target = users.getUser(data.targetUser);
            await createPrivateMessage(data.content, data.title, data.currentUser, data.targetUser);
            if(target) {
                target.emit('message', {
                    type0: 'updatePrivateMessages',
                    target: data.currentUser
                })  
            }
        } else if(data.type === 'getPrivateMessagesSenders') {
            getPrivateMessagesSenders(socket, data.currentUser);
        } else if(data.type === 'getPrivateMessages') {
            getPrivateMessages(socket, data.currentUser, data.targetUser);
        }
    })

    socket.on('disconnect', (): void => {
        console.log(chalk.bgRed.green('-1 user :('));

        if(socket.name) {
            users.removeUser(socket.name);
            io.emit('counter', {
                type: 'siteUsers',
                users: users.getUsers()
            })
        }

        // set setTimeout with clear id, for not to emit if user reload page
    });
})

const start = async (): Promise<void> => {
    try {
        await mongoose.connect(
            dbUrl,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        )
        server.listen(port);

        console.log(chalk.bgYellow.black(`connection success on port ${port}`));
    } catch(e) {
        console.log(chalk.bgRed.black(`connection error, ${e}`));
        server.close(e);
    }
}

start();