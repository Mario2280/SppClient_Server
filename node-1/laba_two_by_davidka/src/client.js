import { connect } from 'socket.io-client';
const socket = connect('http://localhost:8080')
import { pipeline } from 'stream';
import ss from 'socket.io-stream';


socket.on('connect', () => {
//   const stream = ss.createStream()
//   ss(socket).emit('stream', stream)
//   pipeline(createReadStream('README.md'), stream,  (err) => err && console.log(err))

  ss(socket).on('stream', (stream) => {
  pipeline(stream, process.stdout,  (err) => err && console.log(err))
  console.log(stream);
  });

});