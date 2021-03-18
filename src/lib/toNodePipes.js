import fromReadableStream from './fromReadableStream';
import toReadableStream from './toReadableStream';

const toNodePipes = function toNodePipes(pipes) {
  return source$ => {
    const readStream = toReadableStream(source$);
    const outputStream = pipes.reduce(
      (acc, pipe) => acc.pipe(pipe),
      readStream
    );
    return fromReadableStream(outputStream);
  };
};

export default toNodePipes;
