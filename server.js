const { pipeline } = require('stream');
const jwt = require('jsonwebtoken');
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const mime = require('mime-types');
const io = new Server(httpServer, {
    cookie: {
        name: 'token',
        httpOnly: true,
        //sameSite: "strict",
        maxAge: 3600
    },
    cors: {
        origin: '*',
        methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
        credentials: true,
        allowedHeaders: ["Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Cache-Control"]
    }
});
const ss = require('socket.io-stream');
const { createReadStream, createWriteStream, readdirSync, writeFileSync } = require('fs');
const { unlink, writeFile } = require('fs/promises');
const bcrypt = require('bcrypt');

const db = [];
const userDB = [];


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
    //console.log('connected');
    //socket.io middleware check cookie in socket.handshake.headers.cookie
    socket.use((packet, next) => {
        console.log(packet);
        if (packet[0] == 'login' || packet[0] == 'signup' || packet[0] == 'uploadFile' || packet[0] == 'end' || packet[0] == 'chunkOfUploadingFile' || packet[0] == 'downloadFile') {
            return next();
        }
        if (packet[1]?.token && !verifyToken(packet[1].token)) {
            socket.emit('403');
            return next();
        }


    });
    socket.on('getTasks', () => {
        console.log(db);
        socket.emit('Tasks', { task: db });        
    });

    //id просто индекс файла в массиве
    socket.on('deleteTask', data => {
        const files = readdirSync('./uploads');
        let fileDeleted = false;
        for (const file of files) {
            if (file.toString().includes(db[+data.id]?.file?.toString())) {
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

    socket.on('downloadFile', data => {
        const fileName = data.id;
        const read = createReadStream(`./uploads/${fileName}`);
        read.on('data', (chunk) => {
            socket.emit('stream', chunk);
        });
        read.on('end', () => {
            socket.emit('end', mime.lookup(fileName)); 
        });
        console.log(db);
    });
    socket.on('createTask', data => {
        const { name, status, date, extname, withFile } = data;

        db.push({ name, status, date, file: withFile ? `${db.length}${extname ? `${extname}` : ''}` : null, id: db.length });
    });
    //isPut - признак наличия файла в запросе и индекс(1 <--) 
    socket.on('uploadFile',  (isPut) => { 
        let newFile = [];
        let extname = '';
        console.log(isPut);
        if (isPut === false) {
            socket.on('chunkOfUploadingFile', data => {
                newFile.push(data);
            }).on('end', ext => {
                extname = mime.extension(ext);
                writeFileSync(`./uploads/${db.length -1}.${extname}`, Buffer.concat(newFile));

            });
        } else {
            const files = readdirSync('./uploads');
            for (const file of files) {
                if (file.toString().includes(isPut)){
                    unlink(`./uploads/${file.toString()}`).then(() => { 

                    });
                }
            }
            socket.on('chunkOfUploadingFile', data => {
                newFile.push(data);
            });
            socket.on('end', ext => {
                extname = mime.extension(ext);
                writeFileSync(`./uploads/${isPut.toString()}.${extname}`, Buffer.concat(newFile));
                db[+isPut].file = `${isPut}.${extname}`;
            });
            
        }
    });
    //id = '1.txt'
    socket.on('putTask', data => {
        const { name, status, date, id } = data;
        const candidate = +id;
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
            let token = response.data;
            socket.emit('200', token);
        } else {
            socket.emit('401');
        }
    });
});

httpServer.listen(8080);