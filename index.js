// add nodemailer to confirm e-mail
const server = require('http').createServer();
const io = require('socket.io')(server);
const config = require('config');
const mongoose = require('mongoose');

const createTempAcc = require('./controllers/user/createTempAcc');
const createPermAcc = require('./controllers/user/createPermAcc');
const login = require('./controllers/user/login');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

io.on('connection', socket => {
    console.log('+1 user :)');

    socket.on('user', data => {
        if(data.type === 'createTempAcc') {
            createTempAcc(socket, data);
        }
    })

    socket.on('disconnect', () => {
        console.log('-1 user :(')
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