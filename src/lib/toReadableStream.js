import get from 'lodash/get';
import isBuffer from 'lodash/isBuffer';
import {map} from 'rxjs/operators';
import {Readable} from 'stream';

// See The Stream Handbook > Creating a Readable Stream: https://github.com/substack/stream-handbook
const readData = () => size => {
  return size => {
    try {
      const outputBuffer = Buffer.alloc(size);

    } catch (e) {

    }
  };
};

//   fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
//     if (err) {
//       this.destroy(err);
//     } else {
//       this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
//     }
//   });
// };

const createReadStream = (options = {}) => {
  const reader = readData({
    objectMode: get(options, 'objectMode', false),
  });
  const rs = new Readable({
    // we must implement a read method even though in this case
    // it does nothing (it's a push stream and not a pull stream so the read
    // method is useless).
    read: () => true,
    // we set the highWaterMark to a high number (256MB) because the stream
    // might push faster than it can pull
    highWaterMark: get(options, 'highWaterMark', 256000000),
    autoDestroy: get(options, 'autoDestroy', true),
    emitClose: get(options, 'emitClose', true),
  });
  return rs;
};

const toReadableStream = function toReadableStream(
  source$,
  options = {}
) {
  // let cachedBuffers = [];
  const rs = createReadStream(options);
  const buffer$ = source$.pipe(
    map(data => isBuffer(data) ? data : Buffer.from(data))
  );
  buffer$.subscribe(
    // rs.read()
    data => rs.push(data),
    error => rs.destroy(error),
    () => rs.push(null),
  );
  return rs;
};

export default toReadableStream;
