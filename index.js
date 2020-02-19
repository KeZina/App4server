const http = require ('http');
const config = require('config');
const mongoose = require('mongoose');

const dbUrl = config.get('dbUrl');
const port = config.get('port');

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