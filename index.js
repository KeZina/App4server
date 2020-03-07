// add nodemailer to confirm e-mail and maybe OAuth too
const server = require('http').createServer();
const io = require('socket.io')(server);
const config = require('config');
const mongoose = require('mongoose');
const chalk = require('chalk');

const siteUsers = require('./controllers/counter/siteUsers');
const roomUsers = require('./controllers/counter/roomUsers');

const createTempAcc = require('./controllers/user/createTempAcc');
const createPermAcc = require('./controllers/user/createPermAcc');
const login = require('./controllers/user/login');
const logout = require('./controllers/user/logout');
const auth = require('./controllers/user/auth');

const createRoom = require('.//controllers/room/createRoom');
const roomList = require('./controllers/room/roomList');
const enterRoom = require('./controllers/room/enterRoom');

const inviteUser = require('./controllers/message/inviteUser');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

io.on('connection', socket => {
    console.log(chalk.bgGreen.red('+1 user :)'));

    socket.on('user', data => {
        if(data.type === 'createTempAcc') {
            createTempAcc(socket, data);
        } else if(data.type === 'createPermAcc') {
            createPermAcc(socket, data);
        } else if(data.type === 'login') {
            login(socket, data);
        } else if(data.type === 'logout') {
            logout(socket, data);
        } else if(data.type === 'auth') {
            auth(socket, data);
        }
    })

    socket.on('room', data => {
        if(data.type === 'createRoom') {
            createRoom(socket, data);
        } else if (data.type === 'roomList') {
            roomList(socket, data);
        } else if (data.type === 'enterRoom') {
            enterRoom(socket, data);
        }
    })

    socket.on('siteUsers', data => {
        if(data.type === 'addUsers') {
            siteUsers.addUsers(socket, data);
        } else if(data.type === 'removeUsers') {
            siteUsers.removeUsers(data);
        }
        io.emit('counter', {
            type: 'siteUsers',
            users: siteUsers.getUsers()
        })
    })

    // users add to all room, fix this (perhaps problem in io.emit, need emit to specific room)
    socket.on('roomUsers', data => {
        if(data.type === 'addUsers') {
            roomUsers.addUsers(data);
        } else if(data.type === 'removeUsers') {
            roomUsers.removeUsers(data);
        }
        io.emit('counter', {
            type: 'roomUsers',
            users: roomUsers.getUsers()
        })
    })

    socket.on('message', data => {
        if(data.type === 'inviteUser') {
            inviteUser(data);
        }
    })

    socket.on('disconnect', () => {
        console.log(chalk.bgRed.green('-1 user :('));
    });
})

const start = async () => {
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

        console.log(`connection success on port ${port}`);
    } catch(e) {
        console.log(`connection error, ${e}`);
        server.close(e);
    }
}

start();