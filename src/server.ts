import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import pov from 'point-of-view';
import hbs from 'handlebars';
import { join } from 'path';
import { createReadStream } from 'fs';
import multer from 'fastify-multer';

const server = fastify({ logger: true });


const db: Array<Task> = [];

let temp: string;

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const { originalname } = file;
        let newFileName = db.length.toString() + originalname.slice(originalname.lastIndexOf('.'));
        temp = newFileName;
        cb(null, newFileName);
    }
});



const fileUploaded = function (request: FastifyRequest, reply: FastifyReply) {
    const { name, status, date } = (<TaskRequest>request).body;
    db.push({ name, status, date, id: temp ?? null });
    reply.send('File uploaded');
};


server.route({
    method: "POST",
    url: "/task",
    preHandler: multer({ storage }).single('image'),
    handler: fileUploaded
});



server.register(pov, {
    engine: {
        handlebars: hbs
    },
    includeViewExtension: true,
    root: join(__dirname, "views"),
    options: {
        partials: {
            body: 'partials/body.hbs',
        }
    }
})

interface Task {
    name: string;
    id: string;
    status: string;
    date: string;
}



server.get('/task', (req: IdRequest, reply) => {
    const stream = createReadStream(join(__dirname, '../uploads', req.query.id), 'utf8');
    reply.send(stream);
})

server.get('/ping', async (request, reply) => {
    reply.view('main', {
        tasks:
            // [...db]
            [{ name: 'asd', status: 'asd', date: 'asd', id: 'asd' },{ name: 'asd', status: 'asd', date: 'asd'},
             { name: 'asd', status: 'asd', date: 'asd', id: 'asd' }, { name: 'asd', status: 'asd', date: 'asd', id: 'asd' }, { name: 'asd', status: 'asd', date: 'asd', id: 'asd' }]
    })
})

server.listen(8080, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})