import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import pov from 'point-of-view';
import hbs from 'handlebars';
import { join } from 'path';
import { createReadStream, readdirSync } from 'fs';
import multer from 'fastify-multer';

import { unlink } from 'fs/promises';

const server = fastify({
    // logger: {
    //     prettyPrint: true
    // }
});


const db: Array<Task> = [];



let temp: string;
interface Task {
    name: string;
    file: string;
    status: string;
    date: string;
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

server.register(multer.contentParser);

server.addHook('onSend', (request, reply, payload, next) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
    reply.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Cache-Control");
    next()
})

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
    method: "POST",
    url: "/task/put",
    preHandler: multer({ storage }).single('file'),
    handler: filePut
});






server.get('/task', (req: IdRequest, reply) => {
    const stream = createReadStream(join(__dirname, '../uploads', req.query.id));
    reply.header('Content-Type', 'application/octet-stream');
    reply.send(stream);
});

server.post('/task/delete', (request: IdRequest, reply) => {
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