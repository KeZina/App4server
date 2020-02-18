const http = require ('http');
const config = require('config');
const mongoose = require('mongoose');
const WebSocket = require('ws');

const createTemp = require('./controllers/usersAuth/createTemp');
const createPerm = require('./controllers/usersAuth/createPerm');
const login = require('./controllers/usersAuth/login');
const logout = require('./controllers/usersAuth/logout');
const deleteAcc = require('./controllers/usersAuth/deleteAcc');
const checkAuth = require('./controllers/usersAuth/checkAuth');

const createRoom = require('./controllers/rooms/createRoom');
const getRoomList = require('./controllers/rooms/getRoomList');
const getRoom = require('./controllers/rooms/getRoom');
const exitRoom = require('./controllers/rooms/exitRoom');

const createMessage = require('./controllers/messages/createMessage');
const getMessage = require('./controllers/messages/getMessages');

const counter = require('./controllers/counter');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

const server = http.createServer();
const wss = new WebSocket.Server({server});

const sendToAll = (handler, type, content) => wss.clients.forEach(client => client.send(JSON.stringify({
    handler,
    type,
    content
})));

wss.on('connection', ws => {
    console.log('connect');
    ws.on('message', async message => {
        const data = JSON.parse(message);

        switch(data.type) {
            // user cases
            case 'createTemp':
                counter.addSocketInSite(ws);
                await createTemp(data, ws);
                counter.clearEmpty();
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'createPerm':
                counter.addSocketInSite(ws);
                await createPerm(data, ws);
                counter.clearEmpty();
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'login':
                counter.addSocketInSite(ws);
                await login(data, ws);
                counter.clearEmpty();
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            case 'logout':
                await logout(data, ws);
                counter.clearEmpty();
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                sendToAll('counter', 'usersInRooms', counter.getUsersInRooms());
                return;

            case 'deleteAcc':
                await deleteAcc(data,ws);
                counter.clearEmpty();
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return

            case 'checkAuth':
                counter.addSocketInSite(ws);
                await checkAuth(data, ws);
                counter.clearEmpty();
                sendToAll('counter', 'usersInSite', counter.getUsersInSite());
                return;

            // room cases
            case 'createRoom':
                await createRoom(data, ws);
                return;

            case 'getRoomList':
                await getRoomList(ws);
                return;

            case 'getRoom':
                await getRoom(data, ws, sendToAll);
                return;

            case 'exitRoom':
                await exitRoom(data, sendToAll);
                return;

            case 'inviteUser':
                let userToInvite = counter.getUsersInSite().filter(item => item.name === data.name)[0];
                await userToInvite.socket.send(JSON.stringify({handler: 'room', type: 'inviteUser', success: true, roomUrl: data.roomUrl, path: data.path}));
                return;

            // message cases
            case 'createMessage':
                await createMessage.addMessage(data);
                sendToAll('message', 'getMessage', createMessage.getMessage());
                return;

            case 'getMessage':
                await getMessage(data, ws);
                return;
        }
    })
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