# @buccaneerai/PACKAGE_NAME
> 👂 FIXME - add description

## Installation
This is a private package. It requires setting up access in your npm config.

```bash
yarn add @buccaneerai/PACKAGE_NAME
```

## API

FIXME - write some docs so other devs know how the public API works.
### `myFunc`
```js
import {map} from 'rxjs/operators';
import {myFunction} from '@buccaneerai/PACKAGE_NAME';

// The pipeline can take a stream of audio chunks encoded as 
// LINEAR16 (PCM encoded as 16-bit integers) in the form of a Buffer
const buffer$ = pcmChunkEncodedAs16BitIntegers$.pipe(
  map(chunk => Buffer.from(chunk, 'base64')),
  toDeepgram({
    username: process.env.DEEPGRAM_USERNAME,
    password: process.env.DEEPGRAM_PASSWORD,
  })
);
buffer$.subscribe(console.log); // log transcript output
```
