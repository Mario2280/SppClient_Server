import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import { join } from 'path';
import { createReadStream, readdirSync } from 'fs';
import multer from 'fastify-multer';
import { unlink } from 'fs/promises';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookie from 'fastify-cookie';
import { FastifyCookieOptions } from 'fastify-cookie'

const JWT_SECRET = 'secret';
let token: string;

const server = fastify({
    // logger: {
    //     prettyPrint: true
    // }
});

const db: Array<Task> = [];

const userDB: Array<User> = [];

let temp: string;
interface Task {
    name: string;
    file: string;
    status: string;
    date: string;
}
interface User {
    email: string;
    password: string;
}

type IdRequest = FastifyRequest<{
    Querystring: {
        id: string;
    };
}>;

type TaskRequest = FastifyRequest<{
    Body: {
        name: string;
        status: string;
        date: string;
    };
}>;

server.register(require('fastify-cors'), {  
    origin: '*',
    methods: ['POST', 'PUT', 'DELETE'],
  })

server.register(cookie, {
    secret: "my-secret", // for cookies signature
    parseOptions: {}     // options for parsing cookies
} as FastifyCookieOptions)

server.addHook('onSend', (request, reply, payload, next) => {
    reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
    reply.header('Access-Control-Allow-Credentials', 'true');
    reply.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    reply.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Cache-Control");
    next()
});

server.addHook('onRequest', (req, reply, done) => {
    if (req.url != '/login' && req.url != '/signup') {
        if (!verifyToken(req.cookies.token)) {
            reply.code(401).send('Incorrect token');
        }
        console.log(db, userDB);
    }
    done();
});

server.register(multer.contentParser);



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        if (!req.url.includes('/task/put')) {
            const { originalname } = file;
            let newFileName = db.length.toString() + originalname.slice(originalname.lastIndexOf('.'));
            temp = newFileName;
            cb(null, newFileName);
        } else {


            const { id } = (<any>req).query;
            const candidate = +(id.slice(0, id.lastIndexOf('.')));
            unlink(`./uploads/${db[candidate].file}`).then(() => {
                const { originalname } = file;
                let newFileName = candidate + originalname.slice(originalname.lastIndexOf('.'));
                db[candidate].file = newFileName;
                cb(null, newFileName);
            })
        }

    }
});

const fileUploaded = function (request: FastifyRequest, reply: FastifyReply) {
    const { name, status, date } = (<TaskRequest>request).body;
    if (temp == '' || temp == undefined) temp = `${db.length}`;
    db.push({ name, status, date, file: temp });
    reply.send({ file: temp });
    temp = '';
};

const filePut = function (request: FastifyRequest, reply: FastifyReply) {
    const { name, status, date } = (<any>request).body;
    const id = (<any>request).query.id;

    const candidate = +(id.slice(0, id.lastIndexOf('.')));
    name != null ? db[candidate].name = name : null;
    status != null ? db[candidate].status = status : null;
    date != null ? db[candidate].date = date : null;
    reply.code(200).send({ file: db[candidate].file });
};
server.route({
    method: "POST",
    url: "/task",
    preHandler: multer({ storage }).single('file'),
    handler: fileUploaded
});

server.route({
    method: "PUT",
    url: "/task",
    preHandler: multer({ storage }).single('file'),
    handler: filePut
});



server.post('/signup', async (req, res) => {
    const { email, password } = (<any>req).body;

    if (userDB.findIndex(el => el.email == email) >= 0) {
        res.send('Already exist');
    } else {
        try {
            const passwordDB = await bcrypt.hash(password, 10);
            userDB.push({ email, password: passwordDB });
            res.send('Created');
        } catch (e) {
            return res.send(e);
        }
    }
})


const verifyUserLogin = async (email: string, password: string) => {
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
}

const verifyToken = (token: string) => {
    try {
        const verify = jwt.verify(token, JWT_SECRET);
        if ((<any>verify).type === 'user') { return true; }
        else { return false };
    } catch (error) {
        console.log(JSON.stringify(error), "error");
        return false;
    }
}

server.post('/login', async (req, res) => {
    const { email, password } = (<any>req).body;
    const response = await verifyUserLogin(email, password);
    if (response.status === 'ok') {

        res.setCookie('token', token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
        res.send('OK');
    } else {
        res.code(401).send(response);
    }
})

server.get('/task', (req: IdRequest, reply) => {
    const stream = createReadStream(join(__dirname, '../uploads', req.query.id));
    reply.header('Content-Type', 'application/octet-stream');
    reply.send(stream);
});

// server.post('/task/delete', (request: IdRequest, reply) => {
//     const files = readdirSync('./uploads');
//     let flag = false;
//     for (const file of files) {
//         if (file.toString().includes(db[+request.query.id].file.toString())) {
//             unlink(`./uploads/${db[+request.query.id].file}`).then(() => {
//                 db.splice(request.id, 1);
//                 reply.code(200).send();
//                 flag = true;
//             })
//         }
//     }
//     if (!flag) {
//         db.splice(request.id, 1);
//         reply.code(200).send();
//     }
// })
server.delete('/task', (request: IdRequest, reply) => {
    const files = readdirSync('./uploads');
    let flag = false;
    for (const file of files) {
        if (file.toString().includes(db[+request.query.id].file.toString())) {
            unlink(`./uploads/${db[+request.query.id].file}`).then(() => {
                db.splice(request.id, 1);
                reply.code(200).send();
                flag = true;
            })
        }
    }
    if (!flag) {
        db.splice(request.id, 1);
        reply.code(200).send();
    }
})

server.get('/task/all', async (request, reply) => {
    try {
        reply.send({ task: db });
    } catch (error) {
        reply.send(error);
    }
})

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})