const { pipeline } = require('stream');
// const server = require('http').Server({
//     cookie: true
// }).listen(8080);
// const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
    cookie: {
        name: 'token',
        httpOnly: true,
        //sameSite: "strict",
        maxAge: 3600
    },
    cors:{
        origin:'*',
        methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
        credentials: true,
        allowedHeaders: ["Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Cache-Control"]
    }
});
const ss = require('socket.io-stream');
const { createReadStream, createWriteStream, readdirSync } = require('fs');
const { unlink } = require('fs/promises');
const bcrypt = require('bcrypt');

const db = [];
const userDB = [];
let isPutFile = false;

const JWT_SECRET = 'secret';
let token;

const verifyUserLogin = async (email, password) => {
    try {
        const id = userDB.findIndex(el => el.email == email);
        if (id == -1) {
            return { status: 'error', error: 'user not found' }
        }
        if (await bcrypt.compare(password, userDB[id].password)) {
            // creating a JWT token
            token = jwt.sign({ username: userDB[id].email, type: 'user' }, JWT_SECRET, { expiresIn: '2h' })
            return { status: 'ok', data: token }
        }
        return { status: 'error', error: 'invalid password' }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'timed out' }
    }
};

const verifyToken = (token) => {
    try {
        const parsedToken = token.split('=')[1];
        const verify = jwt.verify(parsedToken, JWT_SECRET);
        if ((verify).type === 'user') return true;
        else return false;
    } catch (error) {
        console.log(JSON.stringify(error), "error");
        return false;
    }
};


io.on('connection', (socket) => {

    //socket.io middleware check cookie in socket.handshake.headers.cookie
    // socket.use((packet, next) => {
    //     if (packet[0] == 'login' || packet[0] == 'signup') {
    //         return next();
    //     }
    //     if (!verifyToken(socket.handshake.headers.cookie)) {
    //         return next(new Error('Incorrect token'));
    //     }


    // });
    socket.on('getTasks', () => {
        socket.emit('Tasks', { tasks: db });
    });

    //id просто индекс файла в массиве
    socket.on('deleteTask', data => {
        const files = readdirSync('./uploads');
        let fileDeleted = false;
        for (const file of files) {
            if (file.toString().includes(db[+data.id].file.toString())) {
                unlink(`./uploads/${db[+data.id].file}`).then(() => {
                    db.splice(data.id, 1);
                    socket.emit('success');
                    fileDeleted = true;
                });
            }
        }
        if (!fileDeleted) {
            db.splice(data.id, 1);
            socket.emit('success');
        }
    });
    //id = '1.txt'
    socket.on('downloadFile', data => {
        const sendStream = ss.createStream();
        ss(socket).emit('stream', sendStream);
        pipeline(createReadStream(`./uploads/${data.id}`), sendStream, (err) => err && console.log(err));
    });
    //extname '.txt'
    socket.on('createTask', data => {
        const { name, status, date, extname, withFile } = data;
        isPutFile = false;
        db.push({ name, status, date, file: withFile ? `${db.length}${extname ? `${extname}` : ''}` : null });
    });
    //isPutFile - признак наличия файла в запросе и индекс если есть
    socket.on('uploadFile', (stream) => {
        if (isPutFile === false) {
            pipeline(stream,
                createWriteStream(`./uploads/${db.length.toString() + db[db.length].extname}`),
                (err) => err && console.log(err));
        } else {
            unlink(`./uploads/${isPutFile.toString()}`).then(() => {
                pipeline(stream,
                    createWriteStream(`./uploads/${isPutFile.toString()}`),
                    (err) => err && console.log(err));
            });
            isPutFile = false;
        }

    });
    //id = '1.txt'
    socket.on('putTask', data => {
        const { name, status, date, id } = data;
        const candidate = +(id.slice(0, id.lastIndexOf('.')));
        isPutFile = id;
        name != null ? db[candidate].name = name : null;
        status != null ? db[candidate].status = status : null;
        date != null ? db[candidate].date = date : null;
    });

    socket.on('signup', async (data) => {
        const { email, password } = data;

        if (userDB.findIndex(el => el.email == email) >= 0) {
            socket.emit('409');
        } else {
            try {
                const passwordDB = await bcrypt.hash(password, 10);
                userDB.push({ email, password: passwordDB });
                socket.emit('200');
            } catch (e) {
                socket.emit('error', { error: e });
            }
        }
    });

    socket.on('login', async (data) => {
        const { email, password } = data;
        const response = await verifyUserLogin(email, password);
        if (response.status === 'ok') {
            socket.handshake.headers.cookie = `token=${response.data}`;
            socket.emit('200');
        } else {
            socket.emit('401');
        }
    });
});

httpServer.listen(8080);