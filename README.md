# @rxtk/streams
> 🐠 RxJS operators and utilities for worth with streams (node.js ReadableStream, pipes, etc.)

## Installation
This is a private package. It requires setting up access in your npm config.

```bash
yarn add @rxtk/streams
```

## API

### `fromReadableStream`
Creates an RxJS observable from a node.js ReadableStream.
```js
import {createReadStream} from 'fs';
import {fromReadableStream} from '@rxtk/streams';

const readStream = createReadStream('/path/to/my/file.json');
const buffer$ = fromReadableStream(readStream);
buffer$.subscribe(console.log);
// First Buffer content...
// Second Buffer content...
// etc.
```

### `streamFromObservable`
Creates a node.js ReadableStream from an RxJS observable:
```js
import {streamFromObservable} from '@rxtk/streams';

const string$ = from(["hello", "wo", "rld", "!"]);
const readStream = streamFromObservable(string$)
  .on('data', console.log)
  .on('error', console.error)
  .on('end', () => console.log('DONE'));
// hello
// wo
// rld
// !
// DONE
```

### `toNodePipes`
This RxJS operator allows you to use node.js pipes within an RxJS observable.
```js
import {from} from 'rxjs';
import csvParser from 'csv-parse';
import {toNodePipes} from '@rxtk/streams';

const csvString$ = from([
 '"name","systolicBp","dialostilicBp","message"\n', 
 '"Blackbeard",140,91,"Yarr"\n"Crunch",120,', 
 ',180,"Arr"\n"Sparrow",110,70,"Savvy"\n',
]);
const row$ = from(rows);
const pipes = [csvParser()];
const csvStr$ = string$.pipe(
  toNodePipes(...pipes)
);
csvStr$.subscribe(console.log);
// "message"\n
// "Hello"\n
// "My dear sir\n"
// "Arrr"\n
```
Under the hood, this operator does three things:
1. Transform the input observable into a ReadableStream
2. Pipe that ReadableStream into the provided pipe(s) (in the same order in which they were passed in)
3. Pass the stream's output back to an RxJS output Observable

> ⭐️ This operator is meant to be used as syntactic sugar for simple cases.  In some cases, you may need to fine-tune things to your own liking, in which case it might be better to compose your own pipelines from the other helper functions in this module.
