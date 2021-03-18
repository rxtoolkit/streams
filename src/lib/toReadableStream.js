import {rxToStream} from 'rxjs-stream';

const toReadableStream = function toReadableStream(observable$) {
  return rxToStream(observable$);
};

export default toReadableStream;
