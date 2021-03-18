import { Observable } from 'rxjs';
import { publish, refCount } from 'rxjs/operators';

const defaultOptions = {
  completeEventName: 'end',
  nextEventName: 'data',
  errorEventName: 'error',
};

const fromReadableStream = function fromReadableStream(stream, options = {}) {
  const config = {...defaultOptions, ...options};
  stream.pause();
  const obs$ = new Observable(observer => {
    function dataHandler(data) {
      observer.next(data);
    }

    function errorHandler(err) {
      observer.error(err);
    }

    function endHandler() {
      observer.complete();
    }

    stream.addListener(config.nextEventName, dataHandler);
    stream.addListener(config.errorEventName, errorHandler);
    stream.addListener(config.completeEventName, endHandler);
    stream.resume();
    return () => {
      stream.removeListener(dataEventName, dataHandler);
      stream.removeListener('error', errorHandler);
      stream.removeListener(finishEventName, endHandler);
    };
  });
  return obs$.pipe(
    publish(),
    refCount()
  );
};

export default fromReadableStream;
