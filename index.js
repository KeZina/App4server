// add nodemailer to confirm e-mail and maybe OAuth too
const server = require('http').createServer();
const io = require('socket.io')(server);
const config = require('config');
const mongoose = require('mongoose');

const counter = require('./controllers/counter');

const createTempAcc = require('./controllers/user/createTempAcc');
const createPermAcc = require('./controllers/user/createPermAcc');
const login = require('./controllers/user/login');
const logout = require('./controllers/user/logout');
const auth = require('./controllers/user/auth');

const createRoom = require('.//controllers/room/createRoom');
const roomList = require('./controllers/room/roomList');
const enterRoom = require('./controllers/room/enterRoom');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

io.on('connection', socket => {
    console.log('+1 user :)');
    counter.addSiteUsers();
    console.log(counter.getSiteUsers())

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

    socket.on('disconnect', () => {
        console.log('-1 user :(')
        counter.removeSiteUsers();
        console.log(counter.getSiteUsers());
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

        console.log(`connection success on port ${port}`)
    } catch(e) {
        console.log(`connection error, ${e}`)
        server.close(e);
    }
}

start();