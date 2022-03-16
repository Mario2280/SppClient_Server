"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const point_of_view_1 = __importDefault(require("point-of-view"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = require("path");
const fs_1 = require("fs");
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const server = (0, fastify_1.default)({ logger: {
        prettyPrint: true
    } });
const db = [];
let temp;
server.register(fastify_multer_1.default.contentParser);
const storage = fastify_multer_1.default.diskStorage({
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
const fileUploaded = function (request, reply) {
    const { name, status, date } = request.body;
    db.push({ name, status, date, id: temp ?? null });
    reply.send('File uploaded');
};
server.route({
    method: "POST",
    url: "/task",
    preHandler: (0, fastify_multer_1.default)({ storage }).single('file'),
    handler: fileUploaded
});
server.register(point_of_view_1.default, {
    engine: {
        handlebars: handlebars_1.default
    },
    includeViewExtension: true,
    root: (0, path_1.join)(__dirname, "views"),
    options: {
        partials: {
            body: 'partials/body.hbs',
        }
    }
});
server.get('/task', (req, reply) => {
    const stream = (0, fs_1.createReadStream)((0, path_1.join)(__dirname, '../uploads', req.query.id));
    reply.send(stream);
});
server.get('/ping', async (request, reply) => {
    try {
        reply.view('main', {
            tasks: [...db]
            // [{ name: 'a', status: 'w', date: 'q', id: 'e' },
            // { name: 'j', status: 'b', date: 'f', id: 'b' },
            // { name: 'y', status: 'g', date: 'c', id: 'c' },
            // { name: 'n', status: 't', date: '1', id: 'd' }]
        });
    }
    catch (error) {
        reply.send(error);
    }
});
server.listen(8080, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
